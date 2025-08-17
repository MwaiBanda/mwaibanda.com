package main

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"MwaiBanda/model"
)




func main() {
	e := echo.New()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	e.Static("/assets", "frontend/dist/assets")
	e.File("/resume.pdf", "frontend/dist/resume.pdf") 
	e.File("/", "frontend/dist/index.html")
	e.File("/portfolio", "frontend/dist/index.html")
	e.File("/blog/:article", "frontend/dist/index.html")
	api := e.Group("/api")
	api.Use(middleware.CORS())
	v1 := api.Group("/v1")
	v1.GET("/work", func(c echo.Context) error {
		work := []model.Project{
			{
				Name:        "Momentum",
				StartDate:   "May 2024",
				EndDate:     "June 2025",
				Image:       "https://user-images.githubusercontent.com/49708426/184556277-883616f3-9fda-4709-8194-16e3af673486.png",
				Summary:     "Open-source Multiplatform Payments & Video Streaming for Android, iOS & iPadOS with a Go backend use delivery content and stored user generated data. The apps allow users to make payments to the church, streaming sermons, edit & update account information. Persists data locally w/ SQLDelight and Remote w/ Postgres. The architecture emphasizes code sharing between Android, iOS & iPadOS, which all core business logic written in the SDK",
				Description: "",
				Link:        "https://github.com/MwaiBanda/Momentum",
				Tags: []string{
					"KMM", "Jetpack Compose", "SwiftUI",
				},
			},
			{
				Name:        "WPRK",
				StartDate:   "Aug 2021",
				EndDate:     "April 2023",
				Image:       "https://user-images.githubusercontent.com/49708426/173452718-d3a64858-a420-4424-b57c-08b56422e01c.png",
				Summary:     "Open-source Multiplatform Radio & Podcast Streaming for Android, iOS & iPadOS. The apps allow users to connect to live music streams and cycle through podcasts which are playable as well, schedule reminders for shows and call businesses",
				Description: "",
				Link:        "https://github.com/MwaiBanda/WPRK-MultiPlatform",
				Tags: []string{
					"KMM", "Jetpack Compose", "SwiftUI",
				},
			},
		}
		return c.JSON(http.StatusOK, work)
	})

	v1.GET("/articles", func(c echo.Context) error {
		work := []model.Article{
			{
				Name:            "Clean Architecture",
				PublicationDate: "27th Jun, 2022",
				Image: "https://cdn.hashnode.com/res/hashnode/image/upload/v1655934826967/13qIEfNif.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
				Summary:         "Clean Architecture in iOS & Android development. Learn about clean architecture, loose coupling, designing beautiful, maintainable & testable code.",
				Body: `Just like a building architect maps out and separates a building space into different levels, rooms & entrances/exits. So do we separate layers of our apps into different parts to have complete and elegant [loosely coupled](https://en.wikipedia.org/wiki/Loose_coupling) systems. Software Architect is all about [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) to better structure a project, in-order to allow for easier data flow, testing and maintainability.

 We as architects, have various types of architectural patterns to achieve said separation, most common in mobile development are: MVC, MVP, MVVM, Viper, Composable & Clean Architecture. These all architectural patterns aim to achieve the same goal, though varying in their approach/naming strive to achieve separation of concerns.
<h3> Clean Architecture </h3>

<p align="center">
  <img src="https://cdn.hashnode.com/res/hashnode/image/upload/v1656212923022/jWEYA0uVo.png" alt="clean.png" />
</p>


Clean Architecture, is architectural pattern manifested into this world by non other than Uncle Bob([Robert C. Martin)](https://en.wikipedia.org/wiki/Robert_C._Martin). The rings represent each layer of an application, the outermost layers are systems/frameworks of an application, whereas, the inner circles are rules, and policies of an application. The pattern follows the dependence rule, which states that:

> Source code dependencies should point inwards

Which, means foreach outer layer, each outer layer should only reference the closest most inner layer to itself, whereas foreach inner layer, each inner layer should not reference/know anything in any other outer layer, which would include anything from functions, classes and variables or any other data structures. 
- **Entities** - these are core business objects and logic, they contain rules & policies of an application. These can be models, functions or classes.
- **Use Cases** - these allow for the traversal of data from the Entities to Controllers, Gateways or Presenters.
- **Interface Adapters** - these convert data most useful for entities and use-cases to data most convenient to next layer.
- **UI, External Interfaces, DB, Web, Devices** - this layer includes frameworks/databases. In this layer, you write code that connects to UI frameworks and databases, this code is kept in the outermost layer to ensure that you can change UI frameworks and databases, and have your application perform as intended. 

<h3> Why Clean Architecture </h3>

- **Platform agnostic** - meaning, this architectural pattern is not specific to any platform for which you want to build an application whether it be Android, iOS, Web and even console applications.
- **Independent of UI** - meaning, you can easily replace our UI layer, commonly called the Presentation layer in mobile development with any type of UI framework. So, you can switch out your presentation layer frameworks i.e. XML to Jetpack Compose on Android, UIKit to SwiftUI on iOS, vice-versa and have your application work the same because your core business logic doesn’t change.
- **Testability** - meaning,  you can easily test your core business logic since it's separated out and knows nothing of the UI, database or server.
- **Independent of database** - meaning, you can easily replace our data layer, any type of database to cache your data or any type of networking library to fetch your data.

<h3>Clean Architecture in Mobile Development</h3>

Now let's look at an [open source multiplatform podcast and radio stream app](https://github.com/MwaiBanda/WPRK-MultiPlatform) available for Android & iOS, and it's implementation of clean architecture;

<table>
  <tr>
    <td><center><b>Android</b></center></td>
     <td><center><b>iOS</b></center></td>
  </tr>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/49708426/175532609-9b6def23-4c72-4735-b86f-0782dbea4e3f.png" width=50% height=100></td>
    <td><img src="https://user-images.githubusercontent.com/49708426/175534450-fb394dce-7151-46e0-9e65-2dc6a5f71189.png" width=50% height=100></td>
  </tr>
 </table>

<h3>Application Layers</h3>

The main layers of separation are: <br>

- **Data** - contains, [data transfer objects](https://en.wikipedia.org/wiki/Data_transfer_object) & concrete implementations for data fetching & caching
- **Main** - contains, models,  use cases, abstract implementations (Interfaces/protocols) for data fetching & caching **Note:** this layer is commonly named **Domain** however, I name it main, my reasoning behind this is; I feel the domain is the overall platform(Android/iOS) then this is the main layer of that domain. It's just a personal gripe, please follow popular naming conventions
- **Presentation** - contains, UI elements separated by feature, screens & components 
- **Core** - contains, utilities, extensions and other miscellaneous/supporting files
- **Di(Dependency Injection)** - contains, different app specific modules for providing dependencies specific to each module, this layer is optional because you can manually provide your dependencies. Also on iOS with SwiftUI, the framework provides ways of initialising dependencies within views, by specifying with property wrappers what kind of dependency it is.
  
Now let's discuss clean architecture starting with the innermost layer and going outwards 
**Data**

<table>
  <tr>
    <td><center><b>Android</b></center></td>
     <td><center><b>iOS</b></center></td>
  </tr>
  <tr>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175796423-880d3732-1ccb-4ee8-b488-c647d9ac95b5.png" width=50% height=160></center></td>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175796465-4d218fc4-38af-4eaf-8665-2e274a6fc508.png" width=50% height=160></center></td>
  </tr>
 </table>

This is the innermost layer. In this layer we have models(DTOs) we receive from the web server, mapper functions to transform them into domain(main) models and concrete implementations for data fetching and caching(repositories/services).   

<h3> Main </h3>

<table>
  <tr>
    <td><center><b>Android</b></center></td>
     <td><center><b>iOS</b></center></td>
  </tr>
  <tr>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175796663-7615471e-d5c4-4e63-9c54-d1ae2cde3ff8.png" width=50% height=160></center></td>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175800905-e6c6682f-8704-4cb4-8bcb-76766fab4054.png" width=50% height=160></center></td>
  </tr>
 </table>

This layer contains abstract contracts and models we use in our core business logic & presentation layer. Now, why not just use the models received from the server? Because, in most cases the server returns a lot data formatted in a specific way. 

<table>
  <tr>
    <td><center><b>Podcast DTO</b></center></td>
     <td><center><b>Podcast Domain Model</b></center></td>
  </tr>
  <tr>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175832736-a9ae2a9b-17de-4d8d-a57b-4dbc079bfc12.png" width=50% height=160></center></td>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175832934-bb4bee8b-81ba-467f-a511-8991eeb32ea8.png" width=50% height=160></center></td>
  </tr>
 </table>

The server models(DTOs) can be layered and in our cases we don’t even use all the data returned from the server in our core business logic and presentation layer. So for the domain(main) models we declare them with only the data we need and use. Then when the server models are fetched. They get mapped to domain models. Then when we do need more data from the DTOs we just add the required data to the domain models, and as grow them as we go with only the necessary data. 

<h3> Presentation </h3>

<table>
  <tr>
    <td><center><b>Android</b></center></td>
     <td><center><b>iOS</b></center></td>
  </tr>
  <tr>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175796714-074d4680-8e60-4f17-97b2-e05ac03d6314.png" width=50% height=160></center></td>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175796725-8a308ccc-429d-4696-ad46-7e528c3472fa.png" width=50% height=160></center></td>
  </tr>
</table>

This layer is separated by feature i.e auth, screens i.e shows, and components. For the screens and features they hold two types of components we have UI and view-models. The view-model controls access of data to and from the UI. Additionally,  the viewmodels handle actions performed on the view. This enforces separation of concerns and ensures that our UI is loosely coupled from from our business logic. So for every action performed in the UI, that action is delegated to the viewmodel. And whenever, the UI  needs access to data, it gets the data through the viewmodel. Lastly, for ease of maintainability the naming for screens and features are same across Android and iOS, take for example shows:

<table>
  <tr>
    <td><center><b>Android</b></center></td>
     <td><center><b>iOS</b></center></td>
  </tr>
  <tr>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175800706-9cc8fb9c-4ec2-47c6-b2fa-3c35f8d2a873.png" width=50% height=160></center></td>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175800722-3e69c4af-ae39-4b5d-8c0a-1f69b69670b5.png" width=50% height=160></center></td>
  </tr>
</table>

<h3> Core </h3>

<table>
  <tr>
    <td><center><b>Android</b></center></td>
     <td><center><b>iOS</b></center></td>
  </tr>
  <tr>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175796748-1fa8e0d6-dbd8-46c1-9569-702e2d23dc74.png" width=50% height=160></center></td>
    <td><center><img src="https://user-images.githubusercontent.com/49708426/175832967-74c43022-387a-43ec-bcb4-d524ca33c675.png" width=50% height=160></center></td>
  </tr>
 </table>

This layer holds extension functions and utility classes that supplement app functionality. It's a best practice to write extension functions whenever you want to extend functionality of core libraries. This allows to add additional functionality to classes without subclassing them. Other than that, the extensions and the utilities directories is common in mobile development. In the utilities directory, you place classes or functions that supplement our app but are not a core features of our app i.e you can place a connectivity class here that would be responsible to check if the device is connected to the internet.

To sum up, the dependency rule and separation of concerns are the core of software architecture. by adhering to these principles you set yourself up to create to a system that’s easily testable and loosely coupled. You make you system flexible and easily adaptable. UI frameworks come and go, there's also shiny new tools that will grip your heart. By properly architecting your system you can easily swap out these components. Happy learnings, scavenger’s of knowledge. All the best 👋🏾 
`,
				Tags: []string{
					"Android", "iOS",
				},
			},
			{
				Name: "Solid Principles",
				PublicationDate: "13th Jun, 2022",
				Image: "https://cdn.hashnode.com/res/hashnode/image/upload/v1656363122654/opkHs7Rjk.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
				Summary: "Learn SOLID principles by refactoring an open-source radio & podcast streaming app's data layer to reinforce SOLID principles in a real-world project",
				Body: "SOLID principles are rules that help us create classes that can be easily extendable, modifiable, and flexible. The progenitor to these principles is non other than, our friendly neighborhood [*Uncle Bob* (Robert C. Martin)](https://en.wikipedia.org/wiki/Robert_C._Martin). Now let's define these principles;\n\n## SOLID Principles\n\n**S** - *Single Responsibility*  \n**O** - *Open/Close Principle*  \n**L** - *Listov Substitution Principle*  \n**I** - *Interface Segregation*  \n**D** - *Dependency Inversion*  \n\nNext let me introduce to the class we will be working with. It's called ***TransistorRepositoryImpl*** it implements the Interface ***TransistorRepository*** which is a contract with functions the class should implement; ***getPodcasts()***. Transistor is a podcast hosting service thus the naming, original right?\n\n```kotlin\nclass TransistorRepositoryImpl @Inject constructor(\n    private val api: TransistorApi,\n    private val shelf: Shelf\n): TransistorRepository {\n    override suspend fun getPodcasts(): Resource<Podcast> {\n        val cachedPodcasts = shelf.item(PODCASTS_KEY)\n            .apply {\n                if (olderThan(seconds = MAX_CACHE_TIME)) {\n                    put(emptyList<Podcast>())\n                }\n            }\n            .getList(Podcast::class)\n            .orEmpty()\n\n        if (cachedPodcasts.isNotEmpty()) return Resource.Success(cachedPodcasts)\n\n        try {\n            val remotePodcasts = api.getPodcasts(API_KEY = Constants.TRANSISTOR_KEY).collection.map { it.toPodcast() }\n            shelf.item(PODCASTS_KEY).put(remotePodcasts)\n        } catch (e: HttpException) {\n            return Resource.Error(e.localizedMessage ?: \"Http Error Type\")\n        }  catch (e: IOException) {\n            return Resource.Error(e.localizedMessage ?: \"IO Error Type\")\n        }\n        val newlyCachedPodcasts = shelf.item(PODCASTS_KEY)\n            .getList(Podcast::class)\n        return Resource.Success(newlyCachedPodcasts!!)\n    }\n.....\n}\n```\n\nNow let's begin refactoring, while applying the rest of the SOLID principles in no particular order.\n\n### Dependency Inversion\n\n> A class should depend on abstractions and not concretions.\n\n```kotlin\nclass TransistorRepositoryImpl @Inject constructor(\n    private val api: TransistorApi,\n    private val shelf: Shelf\n): TransistorRepository {\n    .....\n}\n```\n\nAs you can see the first dependency is an Interface which is an abstraction so we conform to the rule with regards to the first dependency. However, for the second dependency, which is class. It violates this principle so in order to fix this we need to create an abstraction, on which we can depend on.\n\n### Interface Segregation\n\n> A client should not implement functionality it does not need, hence, multiple interfaces allow each Interface to have functionality only related to itself\n\nSo for the class we are refactoring, remember the second dependency violated the Dependency Inversion principle. Therefore, we create separate interface, which we will depend on, and replace the shelf dependency with an interface called **CacheRepository**.\n\n```kotlin\ninterface CacheRepository {\n    fun getPodcasts(id: String): List<Podcast>\n    fun setPodcasts(id: String, shows: List<Podcast> )\n    ......\n}\n```\n\nThen after, we will create a concrete implementation of the CacheRepository, which is class.\n\n```kotlin\n@Singleton\nclass CacheRepositoryImpl @Inject constructor(\n    private val shelf: Shelf\n): CacheRepository {\n    override fun getPodcasts(id: String): List<Podcast> {\n        return shelf.item(id)\n            .apply {\n                if (olderThan(seconds = MAX_CACHE_TIME)) {\n                    put(emptyList<Podcast>())\n                }\n            }.getList(Podcast::class).orEmpty()\n    }\n\n    override fun setPodcasts(id: String, podcasts: List<Podcast>) {\n        shelf.item(id).put(podcasts)\n    }\n}\n```\n\nNow that we have isolated out the shelf dependency, we can now reference the ***CacheRepository*** in the ***TransistorRepositoryImpl*** then at runtime the ***CacheRepositoryImpl*** is provided with the help of [***Dependency Injection***](https://en.wikipedia.org/wiki/Dependency_injection).\n\n### Single Responsibility\n\n> A class should have a single reason to change hence, every class should have only one responsibility.\n\n```kotlin\nclass TransistorRepositoryImpl @Inject constructor(\n    private val api: TransistorApi,\n    private val shelf: Shelf\n): TransistorRepository {\n    override suspend fun getPodcasts(): Resource<Podcast> {\n        val cachedPodcasts = shelf.item(PODCASTS_KEY)\n            .apply {\n                if (olderThan(seconds = MAX_CACHE_TIME)) {\n                    put(emptyList<Podcast>())\n                }\n            }\n            .getList(Podcast::class)\n            .orEmpty()\n\n        if (cachedPodcasts.isNotEmpty()) return Resource.Success(cachedPodcasts)\n\n        try {\n            val remotePodcasts = api.getPodcasts(API_KEY = Constants.TRANSISTOR_KEY).collection.map { it.toPodcast() }\n            shelf.item(PODCASTS_KEY).put(remotePodcasts)\n        } catch (e: HttpException) {\n            return Resource.Error(e.localizedMessage ?: \"Http Error Type\")\n        }  catch (e: IOException) {\n            return Resource.Error(e.localizedMessage ?: \"IO Error Type\")\n        }\n        val newlyCachedPodcasts = shelf.item(PODCASTS_KEY)\n            .getList(Podcast::class)\n        return Resource.Success(newlyCachedPodcasts!!)\n    }\n.....\n}\n```\n\nSo this class’s responsibility is to fetch podcasts data, which it does. However, single responsibility can also apply to functions within a class to better keep track to bugs and reduce coupling. So if you notice, before making the fetch request, we first check the cache for podcasts with the corresponding podcast ID and return those if the cache is **not** empty else we make a fetch request and put the fetched podcasts in cache then retrieve the newly cached podcasts outside the try/catch block, and return those. Why, do all this? Because with this approach, it allows us to have a [single source of truth](https://en.wikipedia.org/wiki/Single_source_of_truth), which is the cache.\n\nThis function does three things, it fetches data, controls retrieval from the cache and validation of podcasts in the cache by checking if the podcasts have been in the cache longer than the max cache time.\n\nNow let's invert the shelf dependency, and make the changes that comes with that.\n\n```kotlin\nclass TransistorRepositoryImpl @Inject constructor(\n    private val api: TransistorApi,\n    private val cache: CacheRepository\n): TransistorRepository {\n    override suspend fun getPodcasts(): Resource<Podcast> {\n        val cachedPodcasts = cache.getPodcasts(PODCASTS_KEY)\n\n        if (cachedPodcasts.isNotEmpty()) return Resource.Success(cachedPodcasts)\n\n        try {\n            val remotePodcasts = api.getPodcasts(API_KEY = Constants.TRANSISTOR_KEY).collection.map { it.toPodcast() }\n            cache.setPodcasts(PODCASTS_KEY, remotePodcasts)\n        } catch (e: HttpException) {\n            return Resource.Error(e.localizedMessage ?: \"Http Error Type\")\n        }  catch (e: IOException) {\n            return Resource.Error(e.localizedMessage ?: \"IO Error Type\")\n        }\n\n        val newlyCachedPodcasts = cache.getPodcasts(PODCASTS_KEY)\n        return Resource.Success(newlyCachedPodcasts)\n    }\n....\n}\n```\n\nNow that we have inverted the shelf dependency. We in turn, reduce how much the function itself is doing. The two other procedures which were validation/retrieval and insertion are now separate functions within the ***CacheReposityImpl***, and now the function ***getPodcasts()*** does only what it’s named after.\n\n### Open/Close Principle\n\n> A class should be open extension and closed for modification\n\nThis rule states that a class should be closed for changes but open to add addition functionality. Clearly we've violated this rule by completely refactoring the class and function, but let's give this some thought though. If your design does not conform to SOLID principles. Then you change it to facilitate SOLID principles, well this in turn, would you allow not violate this rule in the future.\n\n### Listov Substitution Principle\n\n> A derived class should be substitutable for it's parent/ base class.\n\nWe didn't use this principle in the the examples above but it’s good to know that what it is. So say we have a Creature class which is the base class. We can then have a Person class, and an Animal class. The Creature class has a name, and both the Person class, and an Animal class inherit from the Creature class. So with that, we can the have a method that takes a creature and pass an Animal or Person because of this principle this works.\n\n```kotlin\nopen class Creature(open val name: String) {\n    \n    fun printName() {\n        println(name)\n    }\n}\n\nclass Person(override val name: String): Creature(name) \n\nclass Animal(override val name: String): Creature(name) \n\n\nfun printCreature(creature: Creature) {\n    creature.printName()\n}\n\nfun main() {\n    val person = Person(\"Mwai\")\n    val animal = Animal(\"Dog\")\n    \n    printCreature(person)\n    printCreature(animal)\n\n}\n```\n\nThis outputs\n\n```plaintext\nMwai\nDog\n```\n\nThere you have it, SOLID Principles from a real project and real example. The WPRK app is an open-source podcast and streaming app. 500+ downloads on iOS, 50+ on Android, and 35+ five star ratings. built with SwiftUI & Jetpack Compose. [Available here for potential contributors](https://github.com/MwaiBanda/WPRK-MultiPlatform)\n\nI know shameless self promotion, my justification. It's a cool medium-large scale project. I believe beginners & immediate developer's alike can greatly grow & learn from. Happy learnings, my fellow code connoisseurs. All the best 👋🏾.",
				Tags: []string{
					"Android", "iOS",
				},
			},
		}
		return c.JSON(http.StatusOK, work)
	})
	e.Logger.Fatal(e.Start("0.0.0.0:" + port))
}
