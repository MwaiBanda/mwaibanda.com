---
title: "Clean Architecture"
seoTitle: "Clean Architecture in iOS & Android Development"
seoDescription: "Clean Architecture in iOS & Android development. Learn about clean architecture, loose coupling, designing beautiful, maintainable & testable code."
datePublished: Tue Jun 28 2022 01:55:36 GMT+0000 (Coordinated Universal Time)
cuid: cl4vu86pt0hoc9vnvcqjx73gd
slug: clean-architecture
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1655934826967/13qIEfNif.png
tags: ios, software-architecture, android, clean-code, clean-architecture

---

Just like a building architect maps out and separates a building space into different levels, rooms & entrances/exits. So do we separate layers of our apps into different parts to have complete and elegant [loosely coupled](https://en.wikipedia.org/wiki/Loose_coupling) systems. Software Architect is all about [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) to better structure a project, in-order to allow for easier data flow, testing and maintainability.

 We as architects, have various types of architectural patterns to achieve said separation, most common in mobile development are: MVC, MVP, MVVM, Viper, Composable & Clean Architecture. These all architectural patterns aim to achieve the same goal, though varying in their approach/naming strive to achieve separation of concerns.
<h3> Clean Architecture </h3>

![clean.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1656212923022/jWEYA0uVo.png align="center")


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
- **Independent of database ** - meaning, you can easily replace our data layer, any type of database to cache your data or any type of networking library to fetch your data.

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

<h3> Application Layers </h3>

The main layers of separation are: <br>

- **Data** - contains, [data transfer objects](https://en.wikipedia.org/wiki/Data_transfer_object) & concrete implementations for data fetching & caching
- **Main** - contains, models,  use cases, abstract implementations (Interfaces/protocols) for data fetching & caching **Note:** this layer is commonly named **Domain** however, I name it main, my reasoning behind this is; I feel the domain is the overall platform(Android/iOS) then this is the main layer of that domain. It's just a personal gripe, please follow popular naming conventions
- **Presentation** - contains, UI elements separated by feature, screens & components 
- **Core** - contains, utilities, extensions and other miscellaneous/supporting files
- **Di(Dependency Injection)** - contains, different app specific modules for providing dependencies specific to each module, this layer is optional because you can manually provide your dependencies. Also on iOS with SwiftUI, the framework provides ways of initialising dependencies within views, by specifying with property wrappers what kind of dependency it is.
  
Now let's discuss clean architecture starting with the innermost layer and going outwards 
<h3> Data </h3>

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
