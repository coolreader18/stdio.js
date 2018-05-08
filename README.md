# Easy IO

A simple framework to create simple input/output functions.

## Installation/Usage

The intent is to provide users with a very easy setup process, an entire easy IO app
could be contained in a single HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel=stylesheet href=https://cdn.jsdeliver.net/npm/primer@10.4.0/build/build.css>
  <title>stdio App</title>
  <script src="https://cdn.jsdelivr.net/npm/easy-io/build/easy-io-primer.min.js"></script>
  <script>
  stdio.title("My Cool Thing").add(
    {
      type: "textInput",
      name: "the input",
      label: "Type in right here"
    },
    {
      type: "output",
      link: "the input",
      transform: str =>
        str
          .split("")
          .reverse()
          .join("")
    }
  );
  </script>
</head>
<body>
</body>
</html>
```

That will create a nice looking interface where someone can input a sentence,
and it will spit out the reverse of it.

## License

This project is licensed under the MIT license please see the [LICENSE](LICENSE)
file for more details.
