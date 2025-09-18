i = 1
while True:
    output = ""
    if i % 3 == 0:
        output += "Fizz"
    if i % 5 == 0:
        output += "Buzz"
    if i % 7 == 0:
        output += "Whizz"
    if i % 11 == 0:
        output += "Bang"
    print(output or i)
    if output == "FizzBuzzWhizzBang":
        break
    i += 1
    #Sebastian Kurta