# Code patterns

## Naming functions

When writing a function that queries something with a single given argument, use the prefix `By` followed by its name:

```js
const result = findSomethingById(1);
```

When there are more arguments, prefer to use an object parameter instead of mentioning every one in the function name:

```js
const result = findSomethingBy({ id: 1, name: "Name", size: 12 });
```

# Naming files

Any complex function should name the file and should be the unique exported function.
Utility files are the expection. Simple functions may also break the rule.
