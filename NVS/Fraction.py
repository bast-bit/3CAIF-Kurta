from math import gcd

def add_fractions(num1, den1, num2, den2):
    common_den = den1 * den2
    new_num1 = num1 * den2
    new_num2 = num2 * den1
    result_num = new_num1 + new_num2
    common_divisor = gcd(abs(result_num), common_den)
    result_num //= common_divisor
    common_den //= common_divisor
    return result_num, common_den

def to_mixed_number(num, den):
    whole = num // den
    remainder = abs(num) % den
    if whole != 0 and remainder != 0:
        return f"{whole} {remainder}/{den}"
    elif whole != 0 and remainder == 0:
        return f"{whole}"
    else:
        return f"{num}/{den}"

def get_fraction_input(prompt):
    while True:
        try:
            num = int(input(f"{prompt} Zähler: "))
            den = int(input(f"{prompt} Nenner: "))
            if den == 0:
                print("Der Nenner darf nicht 0 sein. Bitte erneut eingeben.")
                continue
            return num, den
        except ValueError:
            print("Ungültige Eingabe. Bitte geben Sie ganze Zahlen ein.")

def main():
    print("Bruchaddition – Geben Sie zwei Brüche ein.")
    n1, d1 = get_fraction_input("Erster Bruch")
    n2, d2 = get_fraction_input("Zweiter Bruch")
    result_num, result_den = add_fractions(n1, d1, n2, d2)
    result_mixed = to_mixed_number(result_num, result_den)
    print("\nErgebnis:")
    print(f"{n1}/{d1} + {n2}/{d2} = {result_num}/{result_den}")
    print(f"Als gemischte Zahl: {result_mixed}")

if __name__ == "__main__":
    main()

#Sebastian Kurta
