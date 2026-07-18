# Testovací skript

Zdroj: [https://bioinformatika.moodiy.science/mod/page/view.php?id=20](https://bioinformatika.moodiy.science/mod/page/view.php?id=20)

---

#### Testování z příkazové řádky


Pokud testujete svůj program opakovaným copy-pastováním pro scanf/fgets/getline



```c
#include // Důležitá knihovna

int main() {
char *input_data = "TESTOVACÍ DATA\n O TVOJÍ TLUSTÉ MÁMĚ\n";

int p[2];
pipe(p);
write(p[1], input_data, strlen(input_data));
close(p[1]); // Poslat EOF
dup2(p[0], STDIN_FILENO);
close(p[0]);

my_main();

return 0;
}
```



#### Testování ze souboru


Na testování nepotřebujete VScode (takže se neděste, že ho používám)



<iframe src="https://www.youtube.com/embed/dsTzuD1agPE?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>





* Důležité je abyste mě ve stejné složce: **** kód + složku **** s testy + testovací **** skript


Kód (testshell.sh)



```php
#!/bin/bash

PROG=./
REFERENCE_FOLDER=CZE/*_in.txt

for IN_FILE in $REFERENCE_FOLDER; do
REF_FILE="${IN_FILE/_in.txt/_out.txt}"
$PROG my_out.txt
if ! diff $REF_FILE my_out.txt ; then
echo "Fail: $IN_FILE";
exit
else
echo "OK: $IN_FILE";
fi
done
```
