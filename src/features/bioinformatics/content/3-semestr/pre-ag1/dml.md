# 🧠 Diskrétní matematická logika & Důkazy

Tato sekce slouží jako příprava na teorii grafů a formální logiku v předmětu **AG1**.


* Výukové video k důkazům matematické logiky:
  <iframe src="https://www.youtube.com/embed/Rr_I0tdgubY?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

---

## 📐 Typy důkazů a Matematická logika

Při studiu algoritmů budete muset dokazovat jejich správnost. Zde jsou základní techniky, jak k důkazům přistupovat:

* **Studijní text:** [Typy důkazů (FIT ČVUT)](https://courses.fit.cvut.cz/BI-DML/@master/textbook/sec_0402_typy_dukazu.html)

### ❓ Co je to Důkaz sporem?
Důkaz sporem je jedna z nejběžnějších technik v matematické logice.
* **Princip:** Chceme dokázat tvrzení A ⇒ B. Místo přímého postupu předpokládáme opak – tedy že platí předpoklad A, ale **neplatí** závěr B (vyjádřeno jako: A ∧ ¬B).
* **Cíl:** Postupným logickým odvozováním z tohoto předpokladu dojdeme k zjevnému logickému nesmyslu (sporu) – např. že číslo x je zároveň sudé i liché, nebo že 1 = 0.
* **Závěr:** Protože předpoklad opaku vedl ke sporu, původní tvrzení A ⇒ B musí platit.

---

## 🧠 DMA (Diskrétní matematika pro VŠCHT)

Zde jsou základní koncepty, které studentům na začátku často dělají potíže:

* **Studijní text:** [Diskrétní matematika a logika (FIT ČVUT)](https://courses.fit.cvut.cz/BI-DML/@master/textbook/sec_0204_taut_kontr_splnit.html)

### 1. Nutná a postačující podmínka
Mějme výroky E a F:

Pokud je implikace E ⇒ F pravdivá, pak E je postačující podmínka pro F, a F je nutná podmínka pro E.
Pokud je ekvivalence E ⇔ F pravdivá, pak E je nutná a postačující podmínka pro F.

#### Příklad s dělitelností:
Uvažujme výroky: D₂ (číslo je dělitelné 2), D₃ (dělitelné 3), D₆ (dělitelné 6).

Platí D₆ ⇒ D₂ a D₆ ⇒ D₃. Dělitelnost šesti je postačující podmínkou pro dělitelnost dvěma. Dělitelnost dvěma je nutnou podmínkou pro dělitelnost šesti (pokud číslo není sudé, šesti ho určitě nevydělíte).
Platí D₆ ⇔ (D₂ ∧ D₃). Dělitelnost dvěma a třemi současně je nutnou i postačující podmínkou pro dělitelnost šesti.

### 2. Kvantifikátory: Pro každé (∀) & Existuje (∃)
* **Pro každé (∀x):** "pro všechna x platí", "každé x splňuje".
* **Existuje (∃x):** "existuje x takové, že platí", "alespoň jedno x splňuje".
* **Negování kvantifikátorů:** Při negaci zaměníme ∀ za ∃ (a naopak) a znegujeme samotné tvrzení.
  * *Tvrzení:* Všichni v oranžovém saku lžou. (∀x: lže(x) = 1)
  * *Negace:* Existuje alespoň jeden v oranžovém saku, který nelže. (∃x: lže(x) = 0)

### 3. Logická implikace – Mnemotechnika
Výsledky operace implikace (A ⇒ B) lze popsat vztahem mezi zkoušejícím (Z) a studentem (S):
* **0** = neumí, **1** = umí.

<div class="overflow-x-auto my-6 border border-slate-200/80 rounded-xl shadow-xs"><table class="w-full text-left text-xs sm:text-sm border-collapse">
<thead>
<tr class="bg-slate-100/50 border-b border-slate-200">
<th class="px-4 py-3 text-slate-700 font-semibold">Zkoušející (Z)</th>
<th class="px-4 py-3 text-slate-700 font-semibold">Student (S)</th>
<th class="px-4 py-3 text-slate-700 font-semibold">Z =&gt; S</th>
<th class="px-4 py-3 text-slate-700 font-semibold">Výklad situace</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-4 py-3">0 (neumí)</td>
<td class="px-4 py-3">0 (neumí)</td>
<td class="px-4 py-3 font-bold text-green-600">1</td>
<td class="px-4 py-3">Zkoušející to sám neumí, takže nepozná, že to student taky neumí. Vše v klidu (OK).</td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-4 py-3">0 (neumí)</td>
<td class="px-4 py-3">1 (umí)</td>
<td class="px-4 py-3 font-bold text-green-600">1</td>
<td class="px-4 py-3">Student látku umí a zkouška proběhne bez problémů (OK).</td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-4 py-3">1 (umí)</td>
<td class="px-4 py-3">0 (neumí)</td>
<td class="px-4 py-3 font-bold text-red-600">0</td>
<td class="px-4 py-3 font-medium text-red-600">Zkoušející látku zná a snadno odhalí, že student neumí nic (Problém/RIP).</td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-4 py-3">1 (umí)</td>
<td class="px-4 py-3">1 (umí)</td>
<td class="px-4 py-3 font-bold text-green-600">1</td>
<td class="px-4 py-3">Zkoušející i student látku umí, vše proběhne hladce (OK).</td>
</tr>
</tbody>
</table></div>

---

## 📚 Doporučené studijní zdroje (DML)

Pro úspěšné zvládnutí logiky a diskrétní matematiky doporučujeme tyto ověřené zdroje:

* 📚 **[FIT-Wiki BI-DML](https://fit-wiki.cz/skola/predmety/dml/start)** – Nejdůležitější studentská databáze tipů, vypracovaných zkouškových příkladů a archivů starších zápočtových testů.
* 📝 **[Matematický seminář DML (FIT ČVUT)](https://courses.fit.cvut.cz/BI-DML/)** – Oficiální portál předmětu, kde najdete cvičné materiály a minulé testy.
* 📖 **[Diskrétní matematika (prof. Demel)](http://kmlinux.fjfi.cvut.cz/~demel/discrete.html)** – Klasická a velmi ucelená skripta prof. Demla, na kterých předmět staví. Ideální, pokud potřebujete podrobnější teoretický výklad.
* 🎓 **[Vypracované okruhy ke zkoušce (DML)](https://fit-wiki.cz/skola/predmety/dml/zkouska)** – Strukturované shrnutí všech důležitých vět, definic a důkazů, které se objevují u zkoušky.

### 💡 Tipy, jak se připravit na DML testy:
1. **Procvičujte typové příklady:** Zápočtové testy z logiky se drží stálých šablon. Zvládněte rezoluční metodu (prokazování nesplnitelnosti), převody do KNF/DNF a minimalizaci logických funkcí (např. Karnaughovy mapy).
2. **Učte se přesné definice:** Matematická část předmětu vyžaduje naprosto přesné znění definic. Pokud zapomenete u definice ekvivalence nebo uspořádání na jedno klíčové slovo, body poletí dolů.
3. **Grafy a relace:** Naučte se vlastnosti relací (symetrie, tranzitivita, atd.) a jak je reprezentovat maticí sousednosti nebo grafem. Ulehčí vám to i začátek kurzu AG1.

