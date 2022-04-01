# Onion architecture

The application is layered as follows, from outermost to innermost, following these tenets:

* Outer layers may interact with inner layers arbitrarily
* Sibling layers know nothing of one another
* Inner layers know nothing of outer layers

1. Infrastructure, Presentation
    * Infrastructure implements interfaces defined in the Application layer
    * Presentation provides a means of invoking Application layer behavior
2. Application
    * Implements use cases by orchestrating objects defined in the Domain layer
3. Domain
    * Implements invariants, "business logic"
