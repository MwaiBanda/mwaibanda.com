# SOLID Principles In The Real World

SOLID principles are rules that help us create classes that can be easily extendable, modifiable, and flexible. The progenitor to these principles is non other than,  our friendly neighborhood [*Uncle Bob* 
 (Robert C. Martin)](https://en.wikipedia.org/wiki/Robert_C._Martin). Now let's define these principles;
<h2>SOLID Principles</h2>
**S**  -  *Single Responsibility* <br>
**O**  - *Open/Close Principle* <br>
**L**   -  *Listov Substitution Principle* <br>
**I**    -   *Interface Segregation* <br>
**D**  - *Dependency Inversion* <br>

Next let me introduce to the class we will be working with. It's called ***TransistorRepositoryImpl*** it implements the Interface ***TransistorRepository*** which is a contract with functions the class should implement; ***getPodcasts()***. Transistor is a podcast hosting service thus the naming, original right?

```
class TransistorRepositoryImpl @Inject constructor(
    private val api: TransistorApi,
    private val shelf: Shelf
): TransistorRepository {
    override suspend fun getPodcasts(): Resource<Podcast> {
        val cachedPodcasts = shelf.item(PODCASTS_KEY)
            .apply {
                if (olderThan(seconds = MAX_CACHE_TIME)) {
                    put(emptyList<Podcast>())
                }
            }
            .getList(Podcast::class)
            .orEmpty()

        if (cachedPodcasts.isNotEmpty()) return Resource.Success(cachedPodcasts)

        try {
            val remotePodcasts = api.getPodcasts(API_KEY = Constants.TRANSISTOR_KEY).collection.map { it.toPodcast() }
            shelf.item(PODCASTS_KEY).put(remotePodcasts)
        } catch (e: HttpException) {
            return Resource.Error(e.localizedMessage ?: "Http Error Type")
        }  catch (e: IOException) {
            return Resource.Error(e.localizedMessage ?: "IO Error Type")
        }
        val newlyCachedPodcasts = shelf.item(PODCASTS_KEY)
            .getList(Podcast::class)
        return Resource.Success(newlyCachedPodcasts!!)
    }
.....
}
```
Now let's begin refactoring, while applying the rest of the SOLID principles in no particular order.


<h3>Dependency Inversion</h3>
> A class should depend on abstractions and not concretions.


```
class TransistorRepositoryImpl @Inject constructor(
    private val api: TransistorApi,
    private val shelf: Shelf
): TransistorRepository {
    .....
}
```

As you can see the first dependency is an Interface which is an abstraction so we conform to the rule with regards to the first dependency. However, for the second dependency, which is class. It violates this principle so in order to fix this we need to create an abstraction, on which we can depend on.

<h3>Interface Segregation</h3>
> A client should not implement functionality it does not need, hence, multiple interfaces allow each Interface to have functionality only related to itself 

So for the class we are refactoring, remember the second dependency violated the Dependency Inversion principle. Therefore, we create separate interface, which we will depend on, and replace the shelf dependency with an interface called **CacheRepository**.

```
interface CacheRepository {
    fun getPodcasts(id: String): List<Podcast>
    fun setPodcasts(id: String, shows: List<Podcast> )
    ......
}
```

Then after, we will create a concrete implementation of the CacheRepository, which is class. 
```
@Singleton
class CacheRepositoryImpl @Inject constructor(
    private val shelf: Shelf
): CacheRepository {
    override fun getPodcasts(id: String): List<Podcast> {
        return shelf.item(id)
            .apply {
                if (olderThan(seconds = MAX_CACHE_TIME)) {
                    put(emptyList<Podcast>())
                }
            }.getList(Podcast::class).orEmpty()
    }

    override fun setPodcasts(id: String, podcasts: List<Podcast>) {
        shelf.item(id).put(podcasts)
    }
}
```
Now that we have isolated out the shelf dependency, we can now reference the ***CacheRepository*** in the ***TransistorRepositoryImpl***  then at runtime the ***CacheRepositoryImpl*** is provided with the help of [***Dependency Injection***](https://en.wikipedia.org/wiki/Dependency_injection).

<h3>Single Responsibility</h3>
> A class should have a single reason to change hence, every class should have only one responsibility.


```
class TransistorRepositoryImpl @Inject constructor(
    private val api: TransistorApi,
    private val shelf: Shelf
): TransistorRepository {
    override suspend fun getPodcasts(): Resource<Podcast> {
        val cachedPodcasts = shelf.item(PODCASTS_KEY)
            .apply {
                if (olderThan(seconds = MAX_CACHE_TIME)) {
                    put(emptyList<Podcast>())
                }
            }
            .getList(Podcast::class)
            .orEmpty()

        if (cachedPodcasts.isNotEmpty()) return Resource.Success(cachedPodcasts)

        try {
            val remotePodcasts = api.getPodcasts(API_KEY = Constants.TRANSISTOR_KEY).collection.map { it.toPodcast() }
            shelf.item(PODCASTS_KEY).put(remotePodcasts)
        } catch (e: HttpException) {
            return Resource.Error(e.localizedMessage ?: "Http Error Type")
        }  catch (e: IOException) {
            return Resource.Error(e.localizedMessage ?: "IO Error Type")
        }
        val newlyCachedPodcasts = shelf.item(PODCASTS_KEY)
            .getList(Podcast::class)
        return Resource.Success(newlyCachedPodcasts!!)
    }
.....
}
```

So this class’s responsibility is to fetch podcasts data, which it does. However, single responsibility can also apply to functions within a class to better keep track to bugs and reduce coupling. So if you notice, before making the fetch request, we first check the cache for podcasts with the corresponding podcast ID and return those if the cache is **not** empty else we make a fetch request and put the fetched podcasts in cache then retrieve the newly cached podcasts outside the try/catch block, and return those. Why, do all this? Because with this approach, it allows us to have a [single source of truth](https://en.wikipedia.org/wiki/Single_source_of_truth), which is the cache.
  

This function does three things, it fetches data,  controls retrieval from the cache and validation of podcasts in the cache by checking if the podcasts have been in the cache longer than the max cache time.


Now let's invert the shelf dependency, and make the changes that comes with that.

```
class TransistorRepositoryImpl @Inject constructor(
    private val api: TransistorApi,
    private val cache: CacheRepository
): TransistorRepository {
    override suspend fun getPodcasts(): Resource<Podcast> {
        val cachedPodcasts = cache.getPodcasts(PODCASTS_KEY)

        if (cachedPodcasts.isNotEmpty()) return Resource.Success(cachedPodcasts)

        try {
            val remotePodcasts = api.getPodcasts(API_KEY = Constants.TRANSISTOR_KEY).collection.map { it.toPodcast() }
            cache.setPodcasts(PODCASTS_KEY, remotePodcasts)
        } catch (e: HttpException) {
            return Resource.Error(e.localizedMessage ?: "Http Error Type")
        }  catch (e: IOException) {
            return Resource.Error(e.localizedMessage ?: "IO Error Type")
        }

        val newlyCachedPodcasts = cache.getPodcasts(PODCASTS_KEY)
        return Resource.Success(newlyCachedPodcasts)
    }
....
}
```
Now that we have inverted the shelf dependency. We in turn, reduce how much the function itself is doing. The two other procedures which were validation/retrieval and insertion are now separate functions within the ***CacheReposityImpl***, and now the function ***getPodcasts()*** does only what it’s named after.

<h3>Open/Close Principle</h3>
> A class should be open extension and closed for modification

This rule states that a class should be closed for changes but open to add addition functionality. Clearly we've violated this rule by completely refactoring the class and function, but let's give this some thought though. If your design does not conform to SOLID principles. Then you change it to facilitate SOLID principles, well this in turn,  would you allow not violate this rule in the future. 

<h3>Listov Substitution Principle</h3>
> A derived class should be substitutable for it's parent/ base class.

We didn't use this principle in the the examples above but it’s good to know that what it is. So say we have  a Creature class which is the base class. We can then have a Person class, and an Animal class. The Creature class has a name, and both the Person class, and an Animal class inherit from the Creature class. So with that, we can the have a method that takes a creature and pass an Animal or Person because of this principle this works.

```
open class Creature(open val name: String) {
    
    fun printName() {
        println(name)
    }
}

class Person(override val name: String): Creature(name) 

class Animal(override val name: String): Creature(name) 


fun printCreature(creature: Creature) {
    creature.printName()
}

fun main() {
    val person = Person("Mwai")
    val animal = Animal("Dog")
    
    printCreature(person)
    printCreature(animal)

}
```
This outputs 

```
Mwai
Dog
```

There you have it, SOLID Principles from a real project and real example. The WPRK app is an open-source podcast and streaming app. 500+ downloads on iOS, 50+ on Android, and 35+ five star ratings. built with SwiftUI & Jetpack Compose. [Available here for potential contributors](https://github.com/MwaiBanda/WPRK-MultiPlatform)

I know shameless self promotion, my justification. It's a cool medium-large scale project. I believe beginners & immediate developer's alike can greatly grow & learn from. Happy learnings, my fellow code connoisseurs. All the best 👋🏾.