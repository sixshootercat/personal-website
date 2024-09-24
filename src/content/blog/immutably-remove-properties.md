---
title: Immutably remove object properties in JavaScript
pubDate: 12/05/2021 13:25
author: "Kevin Ruhl"
slug: immutably-remove-properties
tags:
  - JavaScript
  - Programming
imgUrl: "../../assets/spread_operator.png"
description: An alternative approach for removing object properties without the use of the delete operator.
layout: "../../layouts/BlogPost.astro"
---

## Introduction

Most of us have at one point in time needed to remove an object property for whatever reason (i.e. a runtime condition was successfully evaluated, a server response was received, etc.). In these cases, arguably the most commonly used approach was to use the built-in JavaScript `delete` operator which will attempt to remove a given property from an object, if that property exists. This is a perfectly reasonable way of removing an object’s property, but there are some caveats around it that may cause foot shootings if not careful. The most noticeable problem to this approach is in the inherently mutable nature of the `delete` operator. It mutates the underlying object reference, therefore mutating the original object and causing potentially unwanted side effects.

In this article, I will first give an example of removing a property from an object using the `delete` operator, and will then show what I consider a safer alternative approach that uses object destructuring along with the rest operator to accomplish the same. I'll compare the two approaches and explain the pros and cons of each.

---

## ❌ The mutable approach

```typescript
const person = {
  name: "foo",
  age: 34,
};

function removeObjPropertyMutably(obj, key) {
  delete obj[key];
}

removeObjPropertyMutably(person, "name");

console.log(person); // prints out { age: 34 }
```

However, there are some drawbacks to point out when using the delete operator:

1. It will mutate the object reference in memory (i.e. it will not create a new copy).
2. It is only capable of removing one property at a time. Meaning, if your use case requires removing multiple properties, then your code will look a little something like this:

```typescript
const person = {
  name: "joe",
  age: 33,
  email: "joe@gmail.com",
  isOnline: false,
  hasPets: true,
};
delete person.email;
delete person.isOnline;
delete person.hasPets;
```

---

## ✅ A safer immutable approach

Now, let’s see a better and safer alternative to removing object properties using destructuring and rest operator/syntax:

```typescript
const person = {
  name: "foo",
  age: 34,
};

function removeObjPropertyImmutably(obj, key) {
  const { [key]: removedProp, ...objRest } = obj;
  return objRest;
}

const updatedPerson = removeObjPropertyImmutably(person, "name");

console.log(updatedPerson); // prints out { age: 34 }
```

Notice that in doing `…objectRest` , we are creating a new copy of the passed in object (in this case `person`) after having removed the target property (`name`), by dynamically destructuring and aliasing said property. Aliasing in this case refers to naming the variable that will hold the value of the key we want to remove. This way, we can reference it later if we need to.

This approach has the benefit of simultaneously allowing the deletion of multiple properties by means of a single operation. Personally, I find this very handy and practical:

```typescript
const person = {
  name: "joe",
  age: 33,
  email: "joe@gmail.com",
  isOnline: false,
  hasPets: true,
};
const { email, isOnline, hasPets, ...personRest } = person;
```

In the above code snippet, you can see that we are destructuring the keys which we wish to remove — `email`, `isOnline`, and `hasPets`. These are kept in memory as variables that can be accessed if needed to.

So, next time you need to remove a property from an object, you can do so in an immutable, more predictable, and safer way.

_**Note**: Optionally, we can also create a new copy of the original object and then use the `delete` operator on the new object copy, ensuring immutability but being a bit more verbose._

---

## Final Thoughts

Wrapping up, whenever I need to to remove object properties in JavaScript, I reach for using destructuring and rest syntax as I consider it a cleaner and safer option when compared to doing it via the mutable delete operator.
