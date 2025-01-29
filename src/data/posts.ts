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

## Layout
 
Layout, bir uygulamanın genel yapısını oluşturan temel bileşenlerdir. Kullanıcının uygulamayı görüntülemesi için gerekli olan tüm bileşenleri içerir.

### Layout Notları

Layout kısmı ile ilgili notlar sürekli güncellenecektir.

Fotoğraf ekleyeceğinde png, jpg, jpeg gibi formatları kullan ve kaydettiğin resmi kopyalayıp \`drawable klasörüne\` yapıştır.

## Constraint Layout

Constraint Layoutlarda ekrandaki yerlerini belirliyoruz, şuradan şu kadar boşluk var gibi.

- Constrait ayarlarken resmin, yazının, butonun üzerine tıklayarak çıkan daireler ile sayfada hizalamasını yapıyoruz.
- Constraint Layout'ta resimleri veya butonları sürekli yeniden boyutlandırabiliriz.

>Not: Constraint Layout'ta resimleri veya butonları HER cihazda ortada yapmak için sayfanın sağına ve soluna sabitleyip aynı boşluğu bırakıyoruz, ardından boyutları dinamik ayarlamak için width ve height'ı \`0dp (match constraint)\`olarak ayarlıyoruz.

>Not: Infer Constraint ile çok basit düzeydeki sayfalar için hizalama yapabiliriz ama birkaç bileşenden sonra sapıtıyor, manuel yapmak en iyisi :) 

## Linear Layout

Linear Layout, bir düz çizgi üzerinde elemanları hizalama yapmak için kullanılır.

- Linear Layout'ta elemanları yatay veya dikey olarak hizalama yapabiliriz. \`andorid:orientation\` komutu ile belirtilir.

- Linear Layout'ta da elemanların boyutlarını ayarlayabiliriz.

- Komponentler xml dosyasındaki sıralarına göre hizalanır. Yani resim üstte dursun istersen kodda da üstte olmalı.

- Layout_gravity ile komponentlerin hizalanmasını ayarlayabiliriz, center vs..

## Frame Layout

Frame Layout sayfanın tamamını kaplayacak şekilde çalışır, mesela bir harita uygulamasında harita kısmını kaplamak için kullanılır.

## Relative Layout 

Relative Layout, sayfadaki elemanların birbirlerine göre konumlarını belirlemek için kullanılır.

Constraint Layout çıktıktan sonra pek kullanılmıyor, constraintten devam.

## Grid Layout

Grid Layout, ızgara görünümü gibi bir görünüm oluşturmak için kullanılır.

Constraint Layout çıktıktan sonra pek kullanılmıyor, constraintten devam.

## XML Layout

XML, yaptığımız arayüzün kodlarını yazdığımız dosyadır.  

XML kodlarını ezberleye gerek yok, çalışılan komponentin üstüne tıklayınca kodlarını görebiliriz.

XML Layout kısmı da sürekli güncellenecektir.
- \`activity_main.xml\` dosyası, uygulamanın ana sayfasını temsil eden XML dosyasıdır. Bu dosya, uygulamanın ana ekranını oluşturmak için kullanılır.

- \`andorid:layout_width = "match_parent"\` ilgili komponenti yayıyor, daha büyük bir şey geldiğinde mesela uzun bir metin, bunun taşmaması için daha fazla  alan sağlamış oluyor.

- Benzer şekilde ilgili komponentin rengini, boyutunu, vs. ayarlayabiliriz.

- Constraint Layout'ta ise \`layout_constraintTop_toTopOf\`,  End_ToEndOf gibi kısımlar da kullanılır. Bunlar da hizalama için kullanılır.

- \`"match_parent"\` ilgili komponentin ebeveyninin boyutunu alır. Yani üzerinde çalıştığı cihazın boyutunu alır. 

- \`"wrap_content"\` daha çok metin içeren komponentlerde kullanılır ve içeriğine göre boyutunu dinamik olarak belirler.

## İç İçe Layoutlar 

Bir layout içerisinde başka bir layout kullanmak istersek, bu işlem iç içe layoutlar olarak adlandırılır. 

Constraint Layout içerisinde Linear Layout, Linear Layout içerisinde de Constraint Layout kullanılabilir. Herhangi bir sınırlama veya şart yok.

\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".MainActivity">
    <ImageView
        android:id="@+id/imageView"
        android:layout_width="match_parent"
        android:layout_height="176dp"
        android:layout_marginTop="50dp"
        android:layout_gravity="center"
        app:srcCompat="@drawable/rdr" />

    <TextView
        android:id="@+id/textView"
        android:layout_width="match_parent"
        android:layout_height="30dp"
        android:layout_marginTop="24dp"
        android:text="RDR-2"
        android:textAlignment="center"
        android:textColor="#CC1612"
        android:textColorLink="#D31D1D"
        android:textSize="18sp"
     android:layout_gravity="center"
        />

<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:layout_marginTop="24dp"
    android:gravity="center"> <!-- Duz gravity yapiyoruz buraya dikkat -->


    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="15dp"
        android:text="Iyi Oyun" />
    <!-- Margin top end falan degil sade margin ise her tarafa ayni, mesela burda her tarafa 15dp -->

    <Button
        android:id="@+id/button2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="15dp"
        android:text="Kotu Oyun" />
    </LinearLayout>

</LinearLayout>
\`\`\`

Bu kodda Linear Layout içerisinde Linear Layout kullanılmıştır. 

Vertical tanımlanan bir layoutta yan yana butonlar koymak istersek, horizontal bir layout kullanırız ve bu layoutu da ilgili layoutun içerisinde tanımlarız.

Yazdığımız kodun resmi:

<img src="/images/rdrss.png" width="250" height="450" style="object-fit: cover; display: block; margin: 0;" loading="lazy" alt="Blog Resmi" />

>Not: Kötü diyen bir anca önce sayfayı terk ederse sevinirim tşk.
  `,
  hata: `
## Hata Yakalama


Kotlin'de, hata ayıklama yaparken genellikle try-catch bloklarını kullanırız.

Bu bloklar, programın çalışırken hata meydana gelmesi durumunda, hatayı yakalamamıza ve uygun bir şekilde işlem yapmamıza olanak tanır. 

Aşağıdaki örnekte, bir string değerini integer'a dönüştürmeye çalışacağız ve dönüşüm başarılı olursa sonucu döndüreceğiz, başarısız olursa hata mesajı basacağız.

\`\`\`kotlin
fun intOrNullFonksiyonumuz(str: String): Int? {
    return try {
        // String'i Int'e dönüştürmeye çalışıyoruz
        str.toInt()
    } catch (e: NumberFormatException) {
        // Eğer string geçerli bir sayıya dönüşemezse, hata mesajı gösteriyoruz
        println("Geçersiz giriş: $str sayıya dönüştürülemedi.")
        null
    } catch (e: Exception) {
        // Diğer beklenmedik hatalar için genel bir catch bloğu
        e.printStackTrace()
        null
    }
}

fun main() {
    // Geçerli bir sayı ile test
    val sonuc = intOrNullFonksiyonumuz("10")
    println("Sonuç 1: $sonuc") // 10 döner

    // Geçersiz bir değer ile test
    val sonuc2 = intOrNullFonksiyonumuz("bilo")
    println("Sonuç 2: $sonuc2") // null döner
}
\`\`\`

\`try-catch\` blokları ile hata yakalama işlemi bu şekilde yapılır. try ile işlemi başlatırız ve eğer bir sorun oluşursa catch bloğu ile bu hatayı yakalarız.

\`toInt()\` fonksiyonu geçerli bir sayı ile karşılaşmadığında \`NumberFormatException\` hatası fırlatır. Biz de bu hatayı özel olarak yakalayıp kullanıcıyı bilgilendiriyoruz.


> Not: If-else blok yapısı gibi hangi tür hata olduğunu anlamak için birden fazla catch bloğu kullanılabilir.

### Throw Kullanımı

Kotlin'de, hata oluştuğunda \`throw\` ile exception fırlatılabilir. 

Genellikle try-catch blokları ile birlikte kullanılır, ancak throw fonksiyonu hatayı kendimiz fırlatmak için de kullanılabilir.

\`\`\`kotlin
fun kontrolEt(numara: Int) {
    if (numara < 0) {
        throw IllegalArgumentException("Negatif sayı geçersiz!")
    } else {
        println("Geçerli sayı: $numara")
    }
}

fun main() {
    try {
        kontrolEt(-5) // Burada exception fırlatılır
    } catch (e: IllegalArgumentException) {
        println("Hata: {e.message}") //Süslü parantezden önce $ işareti var.
    }
}
\`\`\`

> Not: throw ile fırlatılan hata, catch bloğu ile yakalanır ve ilgili mesaj ekrana yazdırılır.

## Özet

- Kotlin'de hata yakalama için try-catch blokları kullanılır.
- try bloğu ile işlem başlatılır, eğer hata oluşursa catch bloğu ile hata yakalanır.
- throw ile hata kendimiz de hatayı fırlatabiliriz.
- catch bloğu ile hata yakalanır ve ilgili mesaj ekrana yazdırılır.

    `,
  fonksiyonelProgramlama: `
## Lambda

Kotlinde böyle bir kullanım var:
\`\`\`kotlin
fun yazdigimiYazdir(metin: String){
            println(metin)
        }

yazdigimiYazdir("bilocan")
\`\`\`

Bu kodda yazdigimiYazdir fonksiyonu bir String parametresi alır ve bu parametreyi ekrana yazdırır.

Lambda ise işimizi kolaylaştırır.

\`\`\`kotlin
val yazdigimiYazdir = { metin: String -> println(metin) }
yazdigimiYazdir("bilocan")
\`\`\`

Bu kodda yazdigimiYazdir fonksiyonu bir String parametresi alır ve bu parametreyi ekrana yazdırır.
Lambda kullanımı bu şekilde olur ve işimizi kolaylaştırır.

>Not: Lambda kullanımı için \`->\` operatörü kullanılır.

\`\`\`kotlin
val carpLambda = {a:Int, b:Int -> a*b}
 val sonuc = carpLambda(3,5)
  println(sonuc)

val carpLambdaDigerTurlu : ( Int , Int) -> Int = {a,b -> a*b}
 println(carpLambdaDigerTurlu(3,4))
\`\`\`

## Filter

Filter, bir liste içerisindeki elemanları filtrelemek için kullanılır.

\`\`\`kotlin
val numaraDizisi = arrayOf(2,4,6,8,9,15,20,36,69)
 val filtrelemeListem = numaraDizisi.filter { it <15}
  println(filtrelemeListem)
\`\`\`

Eğer filter olmasa if x<10 falan yapıp diziyi döngüye sokacaktık.

>Not: Filter işlemi için \`filter\` fonksiyonu kullanılır.

## Map

Map, bir liste içerisindeki elemanları değiştirmek için kullanılır.

\`\`\`kotlin
val numaraDizisi = arrayOf(2,4,6,8,9,15,20,36,69)
val kareListesi = numaraDizisi.map { it * it }
println(kareListesi)
\`\`\`

>Not: Map işlemi için \`map\` fonksiyonu kullanılır.

### Ortak Kullanımı (Map ve Filter)

\`\`\`kotlin
val numaraDizisi = arrayOf(2,4,6,8,9,15,20,36,69)
val kareListesi = numaraDizisi.map { it * it }.filter { it < 100 }
println(kareListesi)

//Dizi içerisindeki elemanların karelerini alıp 100'den küçük olanları filtreleyerek ekrana yazdırır.
\`\`\`

## Sınıflarda Map ve Filter Kullanımı

\`\`\`kotlin
class Sanatci (val isim: String, val yas: Int, val enstruman: String) {
}
\`\`\` 
Böyle bir Sanatci sınıfı tanımlayalım.
Şimdi bu sınıftan bazı nesneler üretip bunları bir listeye atarak map ve filter işlemlerini yapalım.

\`\`\`kotlin
val sanatci1= Sanatci("bilo",25,"Gitar")
val sanatci2= Sanatci("aleko",35,"Flut")
val sanatci3= Sanatci("ramo", 45, "Keman")
val sanatciListesi = arrayListOf<Sanatci>(sanatci1,sanatci2,sanatci3)

val otuzdanBuyuklerinIsimleri = sanatciListesi.filter { it.yas >30 }. map { it.isim }
        for (i in otuzdanBuyuklerinIsimleri)
        {
            println(i)
        }
            //Bu kodda sanatciListesi içerisindeki yas değeri 30'dan büyük olan nesnelerin isimlerini ekrana yazdırır.

val kirktanBuyuklerinEnstrumanlari = sanatciListesi.filter { it.yas>40 }.map { it.enstruman }
        kirktanBuyuklerinEnstrumanlari.forEach { println(it) }
        //Bu kodda sanatciListesi içerisindeki yas değeri 40'dan büyük olan nesnelerin enstrumanlarını ekrana yazdırır.
\`\`\`

## Scope 

Kotlin'deki scope fonksiyonları, belirli bir nesnenin içine kod bloğu yerleştirerek, o nesneye kolayca erişim sağlar.

\`let\` fonksiyonu, genellikle null olmayan nesnelerle çalışmak için kullanılır ve bir lambda bloğu içinde nesneye erişim sağlar.

\`\`\`kotlin
var benimInteger: Int? = null
benimInteger = 5
benimInteger?.let { println(it) } // 5 yazdırır çünkü null değil
\`\`\`
Bu örnekte, benimInteger başlangıçta null değerini alır ve daha sonra 5 olarak değiştirilir. let fonksiyonu, benimInteger null değilse çalışır. 
Bu durumda, benimInteger değeri 5 olduğu için let fonksiyonu çalışır ve it (yani benimInteger) değeri ekrana yazdırılır.

\`\`\`kotlin
var yeniInteger = benimInteger.let { it + 1 } ?: 0
println(yeniInteger) // 6 döner çünkü benimInteger 5'e eşit, eğer null olsaydı 0 dönerdi
\`\`\`

Burada, benimInteger?.let { it + 1 } ?: 0 ifadesi, eğer benimInteger null değilse, let fonksiyonu içindeki işlemi (yani 5 + 1) yapar ve yeniInteger'a atar. 
Eğer benimInteger null olsaydı, ?: operatörü devreye girer ve 0 dönerdi.

### Also Kullanımı

Also fonksiyonu, şu işi yaptın, bir de bunu yap, şeklinde kullanılır.

\`\`\`kotlin
var alsoSanatci = sanatciListesi.filter { it.yas <30 }.also { it.forEach { println(it.isim)}}
//Bu kodda sanatciListesi içerisindeki yas değeri 30'dan küçük olan nesneler filtrelenir.
//Filtrelenen nesnelerin isimleri also fonksiyonu ile ekrana yazdırılır.
\`\`\`

>Not: Also fonksiyonu için \`also\` anahtar kelimesi kullanılır.

## Özet

- Kotlin'deki lambda ifadeleri, anonim fonksiyonlardır ve fonksiyonel programlamayı destekler. Bir fonksiyonun parametresi olarak kullanılabilirler.

- map fonksiyonu, map fonksiyonu, bir koleksiyondaki her öğe üzerinde işlem yapar ve yeni bir koleksiyon oluşturur.

- filter fonksiyonu, filter, koleksiyon içerisindeki belirli bir koşulu sağlayan öğeleri filtreleyerek seçip yeni bir koleksiyon döndürür.

- Scope fonksiyonları, bir nesne üzerinde işlem yaparken bağlam sağlar. let, ve yazımızda bahsetmesek de apply, run, with gibi fonksiyonlar da scope fonksiyonlarıdır.

- also fonksiyonu, nesne üzerinde bir işlem yaparken, nesneyi değiştirmeden yan etki oluşturur ve orijinal nesneyi geri döndürür.

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

 Person sınıfından nesne oluşturmak için:

\`\`\`kotlin
val person = Person()
person.name = "Bilocan"
person.age = 22
\`\`\`

## Abstract Class

Abstract class'lar, sınıfların genel özelliklerini ve davranışlarını tanımlamak için kullanılır. 

Kendileri başlı başına bir nesne oluşturamaz, alt sınıflar için temel işlevsellik ve özellikler sunar. İçinde hem somut (tamamlanmış) hem de soyut (tamamlanmamış, override edilmesi gereken) metodlar bulunabilir.

\`\`\`kotlin
abstract class Hayvan {
    abstract fun sesCikar() // Soyut metod, alt sınıfta override edilmeli

    fun hareketEt() { // Somut metod
        println("Hareket ediyorum!")
    }
}

class Kedi : Hayvan() {
    override fun sesCikar() {
        println("Miyav!")
    }
}

fun main() {
    val kedi = Kedi()
    kedi.sesCikar() // Çıktı: Miyav!
    kedi.hareketEt() // Çıktı: Hareket ediyorum!
}
\`\`\`

## Interface

Interface'ler bir sınıf değildir fakat sınıfların belirli davranışlarını zorunlu kılmak için kullanılır.

Tüm metodları varsayılan olarak soyuttur ve override edilmelidir. Ancak, Kotlin'de default bir implementasyon (varsayılan metodlar) da tanımlanabilir. 

Bir sınıf birden fazla interface'i implement edebilir.

\`\`\`kotlin
interface Ucan {
    fun uc() // Soyut metod
}

interface Yuzebilen {
    fun yuz() { // Varsayılan metod
        println("Suda yüzüyorum!")
    }
}

class Marti : Ucan, Yuzebilen {
    override fun uc() {
        println("Gökyüzünde uçuyorum!")
    }
}

fun main() {
    val marti = Marti()
    marti.uc() // Çıktı: Gökyüzünde uçuyorum!
    marti.yuz() // Çıktı: Suda yüzüyorum!
}
\`\`\`


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
//Süslü parantezlerden önce gelmesi gereken $ işareti formatın bozulmaması için silinmiştir.

\`\`\`

>Erişilebilen Değişken:

- ad değişkeni public olduğu için doğrudan erişilebilir.
- kisi.ad = "Ayşe" satırı ile değer atanabilir ve println(kisi.ad) ile okunabilir.

>Erişilemeyen Değişken:

- sifre değişkeni private olduğu için doğrudan erişilemez. println(kisi.sifre) yazmaya çalıştığında hata alırsın.
- Şifreye sadece setSifre ve getSifre metotlarıyla erişim sağlanabilir.

#### Visibility Modifiers

- public: Varsayılan erişim seviyesidir; her yerden erişilebilir.
- private: Yalnızca tanımlandığı sınıf içinde erişilebilir. Dışarıdan erişime kapalıdır.
- protected: Yalnızca tanımlandığı sınıf ve bu sınıftan türetilen alt sınıflarda erişilebilir.
- internal: Aynı modül içerisindeki tüm dosyalardan erişilebilir, modül dışına kapalıdır.

## Çok Biçimlilik (Polymorphism)

Kotlin'de iki tür çok biçimlilik vardır, Static Polymorphism ve Dynamic Polymorphism.

Static Polymorphism, compile time'da belirlenir.

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

## Özet

- Bir sınıf yalnızca bir adet abstract sınıfı miras alabilir. Ancak bir sınıf birden fazla interface'i implement edebilir.
- Kotlin'de sınıflar, nesneleri modellemek için kullanılır ve class anahtar kelimesiyle tanımlanır. Bir sınıf, değişkenler ve fonksiyonlar içerebilir.
- Primary constructor, sınıfın başında tanımlanır ve temel özelliklerin başlatılmasını sağlar. Secondary constructor ise ek ihtiyaçlar için kullanılabilir ve daha esnek başlatma imkânı sunar.
- Kotlin'de bir sınıf, başka bir sınıfın özelliklerini ve davranışlarını \`:\` ile devralabilir. Bu, kodun yeniden kullanılabilirliğini artırır ve daha düzenli bir yapı sağlar.
- Kapsülleme, sınıfın içindeki verileri gizleyerek sadece belirli metotlarla erişime izin verir. private, public, internal ve protected gibi erişim belirleyiciler kullanılarak veri kontrol edilir.
- Çok biçimlilik, aynı metot veya sınıfın farklı şekillerde çalışmasını sağlar. Statik ve dinamik olarak iki türü vardır.
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

\`\`\`kotlin
val dizi = arrayOf(1, 2, 3, 4, 5)
\`\`\`

- Dizi elemanlarına erişmek için:

\`\`\`kotlin
println(dizi[0]) // 1, çünkü ilk eleman 0. index'te ve 1'e eşittir.
println(dizi[1]) // 2, çünkü ikinci eleman 1. index'te ve 2'ye eşittir.
\`\`\`

- Dizi elemanlarını değiştirmek için:

\`\`\`kotlin
dizi[0] = 10
\`\`\`

- Dizi eleman sayısını öğrenmek için:

\`\`\`kotlin
println(dizi.size)
\`\`\`


> Not: Diziler karışık tiplerde değişkenler içerebilir.

\`\`\`kotlin 
val karisik = arrayOf(5, 3.14, true, "bilo")
\`\`\`

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

\`\`\`kotlin
val set = setOf(10, 10, 10, 20, 30)

println(set.size) // Çıktı: 3, çünkü 10 tekrar ediyor
\`\`\`
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

- Değiştirilemez değişken örneği
\`\`\`kotlin
val ogrNo = 12345    // Öğrenci numarası değişmez
\`\`\`

- Değiştirilebilir değişken örneği
\`\`\`kotlin
var not = 85         // Öğrencinin notu değişebilir
\`\`\`


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

\`\`\`kotlin
val kucuk: Byte = 120

val kisa: Short = 30000

val normal: Int = 2000000

val buyuk: Long = 9000000000000L
\`\`\`

> Not: Eğer hiçbir şey belirtmezsek değişkenler int olarak tanımlanır. Örneğin: \`var sayi = 25\`

### 3. Float Değişkenler
Ondalıklı sayıları tutar.

\`\`\`kotlin
val pi = 3.14f    // 'f' harfi Float olduğunu belirtir
\`\`\`


### 4. Double Değişkenler
Daha hassas ondalıklı sayıları tutar.

\`\`\`kotlin
val pi = 3.14159
\`\`\`


### 5. Boolean Değişkenler
\`true\` veya \`false\` değerlerini tutar.

\`\`\`kotlin
val cinsiyet = true
\`\`\`

### 6. Char Değişkenler
Tek bir karakteri tutar.

\`\`\`kotlin
val harf = 'A'
\`\`\`


## Önemli Notlar

- Eğer bir değişkenin değeri değiştirilmeyecekse \`val\` kullanılmalıdır.
- Eğer değişkenin değeri değiştirilecekse \`var\` kullanılmalıdır.
- Kotlin, değişken tipini otomatik olarak belirler (Type Inference).

### Unsigned Değişkenler
Negatif değer almayan değişkenlerdir (UByte, UShort, UInt, ULong).

var maas: UInt = 50000u    // Maaş negatif olamaz

### Explicit ve Implicit Değişken Tanımlama

> Explicit değişken tanımlama:

Explicit değişken tanımlama, değişken tipini kodu yazan kişi özel olarak belirler.

\`\`\`kotlin
var sayi: Int = 10
\`\`\`

> Implicit değişken tanımlama:

Implicit değişken tanımlama, değişken tipini otomatik olarak belirler.

\`\`\`kotlin
var sayi = 10
\`\`\`

Sayı değişkeni otomatik olarak Int tanımlanır. 

### Yazım Stilleri
Değişken tanımlamada genellikle iki tür yazım şekli vardır:

\`\`\`kotlin
var snake_case = "Snake Case yazım örneği"

var camelCase = "Camel Case yazım örneği"
\`\`\`
  `,
  blogunAmaci: `

  Bu blogun amacı yoktur, kendi keyfi zevklerime göre yazıyorum. Sadece bir şeyler denemek istedim nasıl olacak diye o kadar :)

  <img src="/images/resim1.png" width="200" height="200" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />
  `
};

export const posts: Post[] = [
  createPost({
    id: 8,
    title: "Layoutlar ve Çeşitleri - XML",
    content: POST_CONTENTS.android,
    date: "2024-01-26",
    summary: "Bu kısımda Andorid kategorisine Layoutlar ve XML ile giriş yapılacaktır.",
    category: "Android"
  }),
  createPost({
    id: 7,
    title: "Kotlinde Hata Yakalama",
    content: POST_CONTENTS.hata,
    date: "2024-01-24",
    summary: "Bu kısımda Kotlinde hata yakalama hakkında detaylı bilgiler verilecektir.",
    category: "Kotlin"
  }),
  createPost({
    id: 6,
    title: "Kotlinde Fonksiyonel Programlama",
    content: POST_CONTENTS.fonksiyonelProgramlama,
    date: "2024-01-23",
    summary: "Bu kısımda Kotlinde Lambda, Map ve Filter, Scope Fonksiyonları gibi fonksiyonel programlama kavramları hakkında detaylı bilgiler verilecektir.",
    category: "Kotlin"
  }),
  createPost({
    id: 5,
    title: "Kotlin'de Sınıflara ve OOP",
    content: POST_CONTENTS.oop,
    date: "2024-01-22",
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