import { Post } from '@/types/post';
import { slugify } from '@/utils/slugify';
import { marked } from 'marked';
import React from 'react';

const createPost = (post: Omit<Post, 'slug'>): Post => ({
  ...post,
  slug: slugify(post.title)
});

const POST_CONTENTS = {
  android: `
# Androide Giriş

Bu kısımda Andorid ile ilgili temel bilgiler verilecektir.
  `,
  oop: `

## Sınıf Tanımlama

Kotlin'de bir sınıf tanımlamak için \`class\` anahtar kelimesi kullanılır:

\`\`\`kotlin
class Person {
    var name: String = ""
    var age: Int = 0
}
\`\`\`

Görüleceği üzere Person sınıfı içinde name ve age değişkenleri tanımlanmıştır. 
> Person sınıfından tanımlanan nesnelerin name ve age değişkenleri olur ve bu değişkenlerin değeri her nesne için farklı belirlenebilir.

## Constructor 

Kotlin'de birincil (primary) ve ikincil (secondary) constructor'lar bulunur:

### Primary Constructor

\`\`\`kotlin
class SuperKahraman(val isim: String, var yas: Int, var meslek: String) {
  
}
\`\`\`

Primary constructor bu şekilde tanımlanır, daha basit ve temiz bir yapıdır.

### Secondary Constructor

\`\`\`kotlin
class SuperKahraman {
    var isim = ""
    var yas =0
    var meslek =""

    constructor(isim:String, yas: Int, meslek: String){
        this.yas=yas
        this.meslek=meslek
        this.isim=isim
    }

}
\`\`\`

Bu şekilde tanımlanan constructor'a secondary constructor denir. Bu yapı da kabul edilebilir ama primary constructor'dan daha karmaşık ve uğraştırıcıdır.

Bu yüzden primary constructor kullanılır.

## Kalıtım (Inheritance)

Kotlin'de kalıtım için \`:\` operatörü kullanılır:

\`\`\`kotlin
open class Animal {
    open fun makeSound() {
        println("Animal sound")
    }
}

class Dog : Animal() {
    override fun makeSound() {
        println("Woof!")
    }
}
\`\`\`

Verilen örnekte Animal sınıfından kalıtım alan Dog sınıfında makeSound fonksiyonu override edilerek Dog sınıfının içinde kendisine göre çalıştırılmıştır.

>Not: \`open\` anahtar kelimesi ile ana sınıftaki fonksiyonların override edilebilir olması sağlanır.

## Kapsülleme (Encapsulation)

Kapsülleme sınıf içerisindeki verilerin sadece izin verildiği derecede erişebilir olmasını sağlar.

\`\`\`kotlin
class Kisi {
    // Erişilemeyen özel değişken (private)
    private var sifre: String = "ruhi123"

    // Erişilebilen genel değişken (public)
    var ad: String = "Bilinmeyen Kişi"

    // Getter ve Setter metotları (şifreye erişim için)
    fun setSifre(yeniSifre: String) {
        sifre = yeniSifre
    }

    fun getSifre(): String {
        return sifre
    }
}
\`\`\`

Şimdi bu sınıfın içinden kapsülleme'yi kullanmak için:

\`\`\`kotlin
fun main() {
    val kisi = Kisi()

    // Erişilebilen değişken
    kisi.ad = "Ayşe"
    println("Ad: {kisi.ad}")

    // Erişilemeyen değişken
    // println(kisi.sifre) // HATA: 'sifre' özelliği private olduğu için erişilemez.

    // Şifreye erişim için metotlar kullanılmalı
    println("Şifre: {kisi.getSifre()}") // Getter metodu ile erişim
    kisi.setSifre("ruhicenet123") // Setter metodu ile yeni değer atama
    println("Yeni Şifre: {kisi.getSifre()}")
}
//Süslü parantezlerden önce gelmesi gereken $ işareti silinmiştir.

\`\`\`

>Erişilebilen Değişken:

-ad değişkeni public olduğu için doğrudan erişilebilir.
-kisi.ad = "Ayşe" satırı ile değer atanabilir ve println(kisi.ad) ile okunabilir.

>Erişilemeyen Değişken:

-sifre değişkeni private olduğu için doğrudan erişilemez. println(kisi.sifre) yazmaya çalıştığında hata alırsın.
-Şifreye sadece setSifre ve getSifre metotlarıyla erişim sağlanabilir.

## Çok Biçimlilik (Polymorphism)

Kotlin'de iki tür çok biçimlilik vardır, Static Polymorphism ve Dynamic Polymorphism.

Static Polymorphism, compile time'da belirlenir.

Dynamic Polymorphism, runtime'da belirlenir.

### Static Polymorphism

Static polymorphism, compile time'da belirlenir.

\`\`\`kotlin
open class Islemler {

    // Statik Polymorphism: Method Overloading
    fun toplama(x: Int, y: Int): Int {
        return x + y
    }

    fun toplama(x: Int, y: Int, z: Int): Int {
        return x + y + z
    }

    fun toplama(x: Int, y: Int, z: Int, k: Int): Int {
        return x + y + z + k
    }

    // Dinamik Polymorphism: Method Overriding yapma işlemi
    open fun carpma(x: Int, y: Int): Int {
        println("Islemler sınıfındaki carpma fonksiyonu çalıştı")
        return x * y
    }
}

\`\`\`

Şimdi bu sınıfın içinden statik polymorphism'ı kullanmak için:

\`\`\`kotlin
val islem = Islemler()
islem.toplama(1,2)
islem.toplama(1,2,3)
islem.toplama(1,2,3,4)
\`\`\`

### Dinamik Polymorphism

Dinamik polymorphism, runtime'da belirlenir. Dinamik polymorphism'de inheritance yapısı kullanılır.

Aynı işlemler sınıfını kullanarak dinamik polymorphism'ı kullanmak için:

\`\`\`kotlin
class GelişmişIslemler : Islemler() {

    // carpma metodu override edildi
    override fun carpma(x: Int, y: Int): Int {
        println("GelişmişIslemler sınıfındaki carpma fonksiyonu çalıştı")
        return (x * y) * 2 // Örneğin: Sonuç iki katına çıkarıldı
    }
}
\`\`\`

Şimdi bu sınıfın içinden dinamik polymorphism'ı kullanmak için:

\`\`\`kotlin
val gelişmişIslemler = GelişmişIslemler()
gelişmişIslemler.carpma(1,2)
\`\`\`

`,
  conversion: `
Bu kısımda Kotlin'de değişken türlerini değiştirmek için kullanılan conversion ve nullability hakkında detaylı bilgiler verilecektir.

## Conversion (Dönüştürme) İşlemleri

Conversion işlemleri, bir değişkenin türünü değiştirmek için kullanılır.

### String'den Int'e Dönüştürme

\`\`\`kotlin
val sayi = "10"
val sayiInt = sayi.toInt()
println(sayiInt + 5) // Çıktı: 15
\`\`\`

> Not: Artık sayiInt değişkeni üzerinde matematiksel işlemler yapabiliriz. Çünkü sayiInt değeri sayi değişkeninin Int'e çevrilmiş hali oldu.

### Int'den String'e Dönüştürme

\`\`\`kotlin
val sayiInt = 10
val sayiString = sayiInt.toString()
println("Sayı: " + sayiString) // Çıktı: Sayı: 10
\`\`\`

> Not String'e dönüştürülen bir sayı artık matematiksel işlemlerde kullanılamaz. Mesela sayiString + 5 yaparsak hata verir.

### Diğer Dönüştürme İşlemleri

- toDouble(): Int'den Double'a dönüştürme
- toFloat(): Int'den Float'a dönüştürme
- toLong(): Int'den Long'a dönüştürme
- toBoolean(): String'den Boolean'a dönüştürme

## Nullability (Null Olabilirlik)

Kotlin'de değişkenler varsayılan olarak null değer alamaz. Bir değişkenin null olabilmesi için özel olarak belirtilmesi gerekir.
toInt fonksiyonu gibi fonksiyonlarda eğer emin değilsek null olabilirlik belirtmemiz gerekir. Örneğin:

\`\`\`kotlin
val sayi = "bilo"
val sayiInt = sayi.toIntOrNull()
\`\`\`

Eğer toIntOrNull yerine düz toInt kullansaydık program çöküyordu, nullability bunun önüne geçti.
Bir projede denk gelirse if null geldiyse bidaha girdi iste falan yapabilirsin.

### Null Olabilen Değişkenler

\`\`\`kotlin
\`var isim: String? = null\`  // ? işareti ile null olabileceğini belirtiyoruz
\`println(isim?.length)\`     // Güvenli çağrı operatörü, eğer string değil ise null döner, program çökmez.
\`\`\`

### Elvis Operatörü (?:)


Elvis operatoru null gelecek olursa şu değer gelsin diye belirtiyor.
Yani \`(inputtt / 2 ? :20)\` yazdigimizda inputt null ise soldaki islem olmayacağı icin cevap 20 olarak dönecek.


### Güvenli Tip Dönüşümü

\`\`\`kotlin
\`val deger: Any = "Merhaba"\`
\`val metin: String? = deger as? String\`  // Güvenli tip dönüşümü
\`\`\`

## Özet

- Kotlin'de tip dönüşümleri güvenli bir şekilde yapılabilir
- Null olabilirlik özel olarak belirtilmelidir
- Girilen değer tipinden eminsen toInt, toFloat gibi fonksiyonlar kullanabilirsin, değilsen null olabilirlik belirtmen gerekiyor.
- Elvis operatörü ve güvenli çağrı operatörü null kontrolü için kullanılır
- Güvenli tip dönüşümü için as? operatörü kullanılır
  `,
  donguler: `
  ## Karar Yapıları

Karar yapıları, programın hangi kod bloğunun çalıştırılacağını belirler.

### If-Else 

>  If-else karar yapısı ile kodun hangi kısmının çalıştırılacağını belirleyebiliriz.

\`\`\`kotlin
val sayi = 10
if (sayi > 0) {
    println("Pozitif sayı")
} else {
    println("Negatif sayı veya sıfır")
}
\`\`\`

Basitçe görüleceği üzere:
- Eğer sayı 0'dan büyükse "Pozitif sayı" yazdırılır
- Değilse "Negatif sayı veya sıfır" yazdırılır
- Eğer birden fazla koşul varsa else if - else if diye diye devam edebiliriz.

### When 

>  When birden fazla koşulu kontrol etmek için kullanılır ve switch yapısına benzer.

\`\`\`kotlin
val sayi = 10
when (sayi) {
    1 -> println("Bir")
    2 -> println("İki")
    else -> println("Bilinmeyen sayı")
}
\`\`\`

Görüleceği üzere sayi değişkeni 1 ise "Bir" yazdırılır, 2 ise "İki" yazdırılır, değilse "Bilinmeyen sayı" yazdırılır.

## Döngüler

Kotlin'de dört temel döngü türü vardır:
- For Döngüsü
- While Döngüsü
- Foreach Döngüsü

### For Döngüsü

\`\`\`kotlin
 val dizi = arrayListOf(5,10,15,20,25)
    for(numara in dizi ) // numara degiskenini olustudu o dizi icinde gezecek
    {
        println(numara * 5/3) // numara değişkenini 5/3 ile çarparak yazdırıyor
    }
    
    for (numara2 in 0..9) //0..9 yapinca kendi direkt o araligi olusturuyor (0-9 arası)
    {
        println(numara2 * 5) // numara2 değişkenini 5 ile çarparak yazdırıyor
    }
\`\`\`

Görüleceği üzere for döngüsü ile dizi değişkeni içindeki her elemanın değeri numara değişkenine atanır ve sıra sıra numara değişkeni yazdırılır.

### While Döngüsü

\`\`\`kotlin
var sayac = 0
while (sayac < 10) {
    println(sayac)
    sayac++
}
\`\`\`

Görüleceği üzere sayac değişkeni 0'dan başlayarak 10'a kadar artırılırken sayac değişkeni yazdırılır. While içinde sayac arttırılmaz ise sonsuz döngüye gireriz.
> Not: Do while döngüsü de benzerdir, onda sadece farklı olarak önce çalışıyor sonra okuyor, sayac önce çalıştığı için 10'a kadar görüyoruz.

### Foreach Döngüsü

\`\`\`kotlin
val meyveler = listOf("Elma", "Armut", "Karpuz")
meyveler.forEach { meyve -> 
    println(meyve)
}
\`\`\`

Görüleceği üzere dizi değişkeni içindeki her elemanın değeri numara değişkenine atanır ve numara değişkeni yazdırılır.

## Özet 

- if-else ve when karar yapıları, koşul bazlı mantıklar kurmak için kullanılır.
- for, while ve forEach döngüleri, tekrar eden işlemleri verimli bir şekilde yapmamızı sağlar.
- for belirli bir aralıkta veya koleksiyon üzerinde dönerken, while koşul sağlandığı sürece çalışır ve forEach koleksiyonlarda elemanları işler.
  `,
  veriYapilari: `
  ## Diziler (Arrays)

Diziler, aynı tipteki verileri tek bir değişkende saklamak için kullanılır.

Diziler sabit boyutludur ve sonradan eleman eklenemez. 

Dizi elemanlarına index ile erişilir. Index 0'dan başlar.

\`val dizi = arrayOf(1, 2, 3, 4, 5)\`

// Dizi elemanlarına erişmek için:
\`println(dizi[0])\` // 1, çünkü ilk eleman 0. index'te ve 1'e eşittir.
\`println(dizi[1])\` // 2, çünkü ikinci eleman 1. index'te ve 2'ye eşittir.

// Dizi elemanlarını değiştirmek için:
\`dizi[0] = 10\`

// Dizi eleman sayısını öğrenmek için:
\`println(dizi.size)\`


> Not: Diziler karışık tiplerde değişkenler içerebilir.

\`val karisik = arrayOf(5, 3.14, true, "bilo")\`

## Listeler (Lists)

Listeler dinamik boyutlu veri yapılarıdır. Eleman eklenebilir veya çıkarılabilir.

> Liste Türleri:
 1. MutableList (ArrayList): Eleman ekleme/silme yapılabilir.
 2. ImmutableList (listOf): Eleman eklenemez/silinemez.

### MutableList Örneği:

\`\`\`kotlin
val liste = arrayListOf("Ahmet", 265, "Mehmet", true)

println(liste.size)    // Çıktı(Dizi Boyutu): 4
liste.add(25)         // Yeni eleman ekleme
println(liste.size)    // Çıktı(Dizi Boyutu): 5
println(liste[2])      // Çıktı: Mehmet
liste.removeAt(2)     // Eleman silme
println(liste[2])      // Çıktı: true
\`\`\`

### ImmutableList Örneği:

\`\`\`kotlin
val immutableList = listOf("Ahmet", 265, "Mehmet", true)

println(immutableList.size)     // Çıktı(Dizi Boyutu): 4
// immutableList.add(25)       // Hata: UnsupportedOperationException
println(immutableList[2])       // Çıktı: Mehmet
// immutableList.removeAt(2)   // Hata: UnsupportedOperationException
\`\`\`

## Setler (Sets, HashSet)

> Önemli Özellikler:
-Setler, tekrar eden elemanları içermez
-Elemanların sırasını garanti etmez
-Index mantığı yoktur

\`val set = setOf(10, 10, 10, 20, 30)\`

\`println(set.size)\` // Çıktı: 3, çünkü 10 tekrar ediyor

> Setlerde eleman ekleme ve silme için HashSet kullanılır
\`\`\`kotlin
val hashSet = hashSetOf(10, 10, 10, 20, 30)
hashSet.add(40)      // Eleman ekleme
hashSet.remove(10)   // Eleman silme
hashSet.forEach { println(it) } // Çıktı: 20, 30, 40 (Sıralama değişebilir)
\`\`\`

## Mapler (Maps, HashMap)

Map yapıları anahtar-değer (key-value) çiftleri saklar.

> Özellikler:
- Anahtar (key): Benzersizdir.
- Değer (value): Aynı anahtar için değiştirilebilir.

### Kötü Kullanım Örneği:

\`\`\`kotlin
val yemekDizisi = arrayListOf("Elma", "Armut", "Karpuz")
val kalorisi = arrayListOf(100, 300, 500)
println("\${yemekDizisi[0]} yiyeceğinin kalorisi \${kalorisi[0]}'dir.")
\`\`\`

> Not: Bu yöntem karışık ve hataya çok açıktır. Bunun yerine HashMap kullanmalıyız.

### HashMap Örneği:

\`\`\`kotlin
val yemekKaloriHesabi = hashMapOf<String, Int>()
yemekKaloriHesabi.put("Elma", 100)
yemekKaloriHesabi.put("Armut", 300)

println(yemekKaloriHesabi["Elma"])    // 100
println(yemekKaloriHesabi["Armut"])   // 300

yemekKaloriHesabi["Elma"] = 500      // Değer güncelleme
println(yemekKaloriHesabi["Elma"])    // 500
\`\`\`

## Özet

- Diziler (Arrays): Sabit boyutludur, index ile erişim sağlanır.
- Listeler (Lists): Dinamik boyutludur, eleman eklenebilir/silinebilir.
- Setler (Sets): Her eleman benzersizdir, sırasız bir şekilde tutulur.
- Mapler (Maps): Anahtar-değer çiftleri, anahtarlar benzersizdir.
  `,
  degiskenler: `
  ## Değişken Tanımlama Yöntemleri

Kotlin'de iki tür değişken tanımlama yöntemi vardır:

1. **val** (değiştirilemez)
2. **var** (değiştirilebilir)

\`val\` değişkenleri değiştirilemez iken, \`var\` değişkenleri değiştirilebilir.

### Örnekler:

// Değiştirilemez değişken örneği
val ogrNo = 12345    // Öğrenci numarası değişmez

// Değiştirilebilir değişken örneği
var not = 85         // Öğrencinin notu değişebilir


## Değişken Tipleri

Kotlin'de temel değişken tipleri şunlardır:
- String
- Int
- Float
- Double
- Boolean
- Char

### 1. String Değişkenler
Metinsel ifadeleri tutar.

val isim = "Bilal"


### 2. Sayısal Değişkenler

#### Tam Sayı Tipleri:

| Tip | Bit | Aralık |
|-----|-----|---------|
| Byte |  8-bit | -128 ile 127 |
| Short | 16-bit | -32,768 ile 32,767 |
| Int |   32-bit | -2³¹ ile 2³¹-1 |
| Long |  64-bit | -2⁶³ ile 2⁶³-1 |


val kucuk: Byte = 120
val kisa: Short = 30000
val normal: Int = 2000000
val buyuk: Long = 9000000000000L


> Not: Eğer hiçbir şey belirtmezsek değişkenler int olarak tanımlanır. Örneğin: \`var sayi = 25\`

### 3. Float Değişkenler
Ondalıklı sayıları tutar.

val pi = 3.14f    // 'f' harfi Float olduğunu belirtir


### 4. Double Değişkenler
Daha hassas ondalıklı sayıları tutar.

val pi = 3.14159


### 5. Boolean Değişkenler
\`true\` veya \`false\` değerlerini tutar.

val cinsiyet = true

### 6. Char Değişkenler
Tek bir karakteri tutar.

val harf = 'A'


## Önemli Notlar

- ⚠️ Eğer bir değişkenin değeri değiştirilmeyecekse \`val\` kullanılmalıdır.
- ⚠️ Eğer değişkenin değeri değiştirilecekse \`var\` kullanılmalıdır.
- 💡 Kotlin, değişken tipini otomatik olarak belirler (Type Inference).

### Unsigned Değişkenler
Negatif değer almayan değişkenlerdir (UByte, UShort, UInt, ULong).

var maas: UInt = 50000u    // Maaş negatif olamaz

### Explicit ve Implicit Değişken Tanımlama

> Explicit değişken tanımlama:

Explicit değişken tanımlama, değişken tipini kodu yazan kişi özel olarak belirler.

\`var sayi: Int = 10\`

> Implicit değişken tanımlama:

Implicit değişken tanımlama, değişken tipini otomatik olarak belirler.

\`var sayi = 10\`

Sayı değişkeni otomatik olarak Int tanımlanır. 

### Yazım Stilleri
Değişken tanımlamada genellikle iki tür yazım şekli vardır:

var snake_case = "Snake Case yazım örneği"
var camelCase = "Camel Case yazım örneği"
  `,
  blogunAmaci: `

  Bu blogun amacı yoktur, kendi keyfi zevklerime göre yazıyorum. Sadece bir şeyler denemek istedim nasıl olacak diye o kadar :)
  `
};

export const posts: Post[] = [
  createPost({
    id: 6,
    title: "Androide Giriş",
    content: POST_CONTENTS.android,
    date: "2024-01-25",
    summary: "Bu kısımda Andorid ile ilgili temel bilgiler verilecektir.",
    category: "Android"
  }),
  createPost({
    id: 5,
    title: "Kotlin'de Sınıflara ve OOP'ye Giriş",
    content: POST_CONTENTS.oop,
    date: "2024-01-24",
    summary: "Kotlin'de nesne yönelimli programlama kavramlarını ve sınıfların nasıl kullanıldığını öğrenelim.",
    category: "Kotlin"
  }),
  createPost({
    id: 4,
    title: 'Kotlinde Dönüştürme(Conversion) ve Nullability',
    category: 'Kotlin',
    date: '2025.01.16',
    summary: 'Bu kısımda Kotlinde değişken türlerini değiştirmek için kullanılan conversion ve nullability hakkında detaylı bilgiler verilecektir',
    content: POST_CONTENTS.conversion
  }),
  createPost({
    id: 3,
    title: 'Kotlinde Karar Yapıları ve Döngüler',
    category: 'Kotlin',
    date: '2025.01.15',
    summary: 'Bu kısımda Kotlinde karar yapıları (if-else, when) ve döngüler (for, while, do-while, foreach) hakkında detaylı bilgiler verilecektir.',
    content: POST_CONTENTS.donguler
  }),
  createPost({
    id: 2,
    title: 'Kotlinde Diziler, Listeler, Mapler ve Setler',
    category: 'Kotlin',
    date: '2025.01.14',
    summary: 'Bu kısımda Kotlinde Diziler, Listeler, Mapler ve Setler hakkında detaylı bilgiler verilecektir.',
    content: POST_CONTENTS.veriYapilari
  }),
  createPost({
    id: 1,
    title: 'Kotlinde Değişken Tanımlama ve Değişken Tipleri',
    category: 'Kotlin',
    date: '2025.01.14',
    summary: 'Bu kısımda Kotlinde bulunan çeşitli değişken tanımlama yöntemleri ve değişken tipleri hakkında detaylı bilgiler verilecektir.',
    content: POST_CONTENTS.degiskenler
  }),
  createPost({
    id: 0,
    title: 'Blogun Amacı',
    category: 'Blogun Amacı',
    date: '2025.01.12',
    summary: 'Blogu neden açtım? Böyle bir blog neden var :D',
    content: POST_CONTENTS.blogunAmaci
  })
]; 