import { Post } from '@/types/post';
import { slugify } from '@/utils/slugify';
import { marked } from 'marked';
import React from 'react';

const createPost = (post: Omit<Post, 'slug'>): Post => ({
  ...post,
  slug: slugify(post.title)
});

const POST_CONTENTS = {    
    firebase: `

# Firebase

Firebase, Google tarafından geliştirilen ve gerçek zamanlı çalışan bir veri tabanı yönetim aracıdır. 

Küçük ve orta ölçekli uygulamalar için oldukça kullanışlı bir veri tabanı sistemidir.

Firebase'i kullanmak için şu adımları izliyoruz:

- Firebase konsolunda projemizi oluşturuyoruz.
- Projemize bir uygulama ekliyoruz.
- Uygulamamıza Firebase'i ekleyiyoruz.

İlk iki adım basit ve bahsetmeye değer olmadığından bu yazıda üçüncü adıma odaklanacağım.

Şimdi ilk olarak projenize Firebase'i ekleyelim.

Bizim projemiz için gerekli olan dependency'leri gradle (app) klasörümüze şu şekilde ekliyoruz:
\`\`\`kotlin
implementation(platform("com.google.firebase:firebase-bom:32.8.1"))
implementation("com.google.firebase:firebase-analytics")
implementation("com.google.firebase:firebase-auth")
implementation("com.google.firebase:firebase-firestore")
implementation("com.google.firebase:firebase-storage")
implementation ("com.squareup.picasso:picasso:2.71828")
\`\`\`

Firebase'in hangi özelliğini kullanacaksak onları import etmemiz gerekiyor, mesela picasso kütüphanesini de ekledik çünkü uygulamamızda resim yükleme işlemi yapıyoruz.

> Not: Bu kütüphanelerin ismi yeni katalog ile birlikte değişmiştir. 

Şimdi kod kısmına geçelim. Uygulamamızda basit şekilde bir kullanıcı giriş-çıkış sistemi ve bir post paylaşma sistemi oluşturacağız.

İlk olarak kullanıcı giriş-çıkış sistemi için gerekli olan kodları yazalım.


Authontecation için gerekli olan tanımlamayı yapalım, sonrasında bunu onCreate içerisinde initialize edelim.

\`\`\`kotlin
private lateinit var auth : FirebaseAuth

//onCreate içerisinde initialize etmek için
auth = Firebase.auth
\`\`\`

Şimdi kullanıcı giriş-çıkış sistemi için gerekli olan kodları yazalım.

## Kayıt Yapma

Öncelikle kayıt olma kısmını şu şekilde yazıyoruz, bunların hepsi Firebase Docs kısmında mevcut.

\`\`\`kotlin
fun kayitOl(view : View){

    val email = binding.emailText.text.toString()
    val password = binding.passwordText.text.toString()

        if (email.isNotEmpty() && password.isNotEmpty()){
            auth.createUserWithEmailAndPassword(email,password).addOnCompleteListener { task ->
                if(task.isSuccessful){
                    //kullanıcı başarıyla oluşturuldu
                    val action = KullaniciFragmentDirections.actionKullaniciFragmentToFeedFragment()
                    Navigation.findNavController(view).navigate(action)
                }
            }.addOnFailureListener { exception ->
                Toast.makeText(requireContext(),exception.localizedMessage,Toast.LENGTH_LONG).show()
            }
        }
    }
\`\`\`

- İlk olarak email ve şifreyi aldığımız değişkenleri tanımlıyoruz ve eğer bunlar boş değilse kullanıcıyı oluşturmaya çalışıyoruz.

- Kullanıcı oluşturulurken şartlar sağlanıyor ise (isSuccessful) kullanıcıyı oluşturup diğer sayfaya navigation yapıyoruz.

- Eğer hata alıyorsak da hata mesajını Toast ile gösteriyoruz.

## Giriş Yapma

Şimdi giriş yapma kısmını yapalım.

\`\`\`kotlin 
fun girisYap(view : View){
        val email = binding.emailText.text.toString()
        val password = binding.passwordText.text.toString()

        //farklı olsun diye onSuccessListener, üstteki gibi yapabilirdik
        if (email.isNotEmpty() && password.isNotEmpty()){
            auth.signInWithEmailAndPassword(email,password).addOnSuccessListener {
                val action = KullaniciFragmentDirections.actionKullaniciFragmentToFeedFragment()
                Navigation.findNavController(view).navigate(action)
        }.addOnFailureListener { exception ->
            Toast.makeText(requireContext(),exception.localizedMessage,Toast.LENGTH_LONG).show()
        }
    }
}
\`\`\`

- Burayı da kayıt ol gibi yapabilirdik, farklı olsun diye onSuccessListener kullanıyoruz. Kalan mantık aynı.

Şimdi eğer kullanıcı girişi yapılmış ise tekrar giriş yapılmasıyla uğraşmaması için onViewCreated içerisinde kontrol edelim.

\`\`\`kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

    binding.kayitButton.setOnClickListener { kayitOl(it) }
    binding.girisButton.setOnClickListener { girisYap(it) }

    val activeUser = auth.currentUser
        if (activeUser != null){
            //kullanıcı önceden giriş yapmış, devam etsin, bidaha giriş yapılmasın
            val action = KullaniciFragmentDirections.actionKullaniciFragmentToFeedFragment()
            Navigation.findNavController(view).navigate(action)
        }
}
\`\`\`

Bu şekilde kullanıcı giriş yapmışsa direk feed fragment'ına yönlendirilmesini sağlıyoruz.

Tabii ki girisyap ve kayitol fonksiyonları için binding kısmını unutmuyoruz :)

## Çıkış Yapma

Şimdi çıkış yapma işlemini yapalım.

Bunun için FeedFragment'ımıza şu kodları yazalım:

- İlk olarak tanımlama

\`\`\`kotlin
private lateinit var auth : FirebaseAuth

//onCreate içerisinde initialize etmek için
auth = Firebase.auth
\`\`\`

Çıkış yapma işlemi için de daha önce oluşturduğumuz menü kısmına sadece şu satırı ekliyoruz:

\`\`\`kotlin
auth.signOut()

/* Bu kısma ekledik yani :)
else if (item?.itemId == R.id.cikisItem){
            auth.signOut()
            val action = FeedFragmentDirections.actionFeedFragmentToKullaniciFragment()
            Navigation.findNavController(requireView()).navigate(action)
    }
*/
\`\`\`

    `,
    menu: `

Androidde menü oluşturmak için öncelikle bir adet android resouce file oluşturuyoruz.

Bu dosyanın resource type'ını menu olarak seçiyoruz ve ismini my_popup_menu olarak belirliyoruz.

Oluşan xml dosyamıza şu kodları yazalım:

\`\`\`kotlin
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">

    <item android:id="@+id/yuklemeItem" android:title="Yeni Post Oluştur"></item>
    <item android:id="@+id/cikisItem" android:title="Çıkış Yap"></item>

</menu>
\`\`\`

Oluşturduğumuz menu xml dosyasına iki adet item ekledik, bunlar yeni post oluştur ve çıkış yap butonları.

Bu butonları aktifleştirmek için şu kodları yazalım:

onViewCreated içerisine

\`\`\`kotlin
 binding.floatingActionButton.setOnClickListener { floatingButtonTiklandi(it)}
\`\`\`

Şimdi butonun tıklanma kodunu yazalım. Öncelikle popup menümüzü tanımlamamız gerekiyor.

\`\`\`kotlin
private lateinit var popup : PopupMenu
\`\`\`

Şimdi popup menümüzün tanımlayalım.

\`\`\`kotlin
popup = PopupMenu(requireContext(),binding.floatingActionButton)
\`\`\`

Şimdi bağlama işlemi için MenuInflater'ı tanımlamamız gerekiyor. Layoutlardaki LayoutInflater'ı menülerde MenuInflater ile değiştiriyoruz.

\`\`\`kotlin
val inflater = popup.menuInflater
    inflater.inflate(R.menu.my_popup_menu,popup.menu)
\`\`\`

Şimdi menüye tıklandığında ne yapılacağını belirleyelim. Bunun için PopupMenu.OnMenuItemClickListener interface'ini implement ediyoruz.

\`\`\`kotlin
class FeedFragment : Fragment(), PopupMenu.OnMenuItemClickListener 
\`\`\`

onMenuItemClick fonksiyonunu override etmeyi unutmuyoruz ve onViewCreated içerisinde \`popup.setOnMenuItemClickListener(this)\` yapıyoruz.

Bu kod ile birlikte menüye tıklandığında this, yani FeedFragment'ın içerisindeki onMenuItemClick fonksiyonuna atıf veriyoruz.

Şimdi override ettiğimiz onMenuItemClick fonksiyonunun içerisinde menüye tıklandığında ne yapılacağının kodunu yazalım.

\`\`\`kotlin
override fun onMenuItemClick(item: MenuItem?): Boolean {

        if (item?.itemId == R.id.yuklemeItem) {
            val action = FeedFragmentDirections.actionFeedFragmentToYuklemeFragment()
            Navigation.findNavController(requireView()).navigate(action)
        } else if (item?.itemId == R.id.cikisItem){
            val action = FeedFragmentDirections.actionFeedFragmentToKullaniciFragment()
            Navigation.findNavController(requireView()).navigate(action)
        }
        return true
    }
}
\`\`\`

Neye tıklandığında ne yapılacağını belirlemek için yeni bir action oluşturup ona göre navigation yapıyoruz.

> Not: Return true yapmamızın sebebi, boolen değer döndürmesi gerektiği içindir.

Şimdi butonumuza tıklandığında popup menümüzün görünmesini sağlayalım.

\`\`\`kotlin
 fun floatingButtonTiklandi(view: View){
        popup.show()
    }
\`\`\`

<img src="/images/menu1.png" width="300" height="250" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

> Menüdeki butonlara tıkladığımızda artık diğer fragmentlere geçiş yapıyoruz.

Son olarak şimdiye kadarki tüm kodlar şu şekilde olacak: 

> Not: Bu kodlar sadece menü oluşturma kısmı için geçerlidir. Herhangi bir çıkış yapma işlemi falan tanımlanmamıştır.

\`\`\`kotlin
package com.bilocan.fotografpaylasma

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.widget.PopupMenu
import androidx.navigation.Navigation
import com.bilocan.fotografpaylasma.databinding.FragmentFeedBinding
import com.bilocan.fotografpaylasma.databinding.FragmentKullaniciBinding

class FeedFragment : Fragment(), PopupMenu.OnMenuItemClickListener {
    private var _binding: FragmentFeedBinding? = null
    private val binding get() = _binding!!

    private lateinit var popup : PopupMenu

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentFeedBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.floatingActionButton.setOnClickListener { floatingButtonTiklandi(it)}
        popup = PopupMenu(requireContext(),binding.floatingActionButton)
        val inflater = popup.menuInflater
        inflater.inflate(R.menu.my_popup_menu,popup.menu)
        popup.setOnMenuItemClickListener(this)
    }

    fun floatingButtonTiklandi(view: View){
        popup.show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onMenuItemClick(item: MenuItem?): Boolean {

        if (item?.itemId == R.id.yuklemeItem) {
            val action = FeedFragmentDirections.actionFeedFragmentToYuklemeFragment()
            Navigation.findNavController(requireView()).navigate(action)
        } else if (item?.itemId == R.id.cikisItem){
            val action = FeedFragmentDirections.actionFeedFragmentToKullaniciFragment()
            Navigation.findNavController(requireView()).navigate(action)
        }
        return true
    }
}
\`\`\`


    `,
    sifre: `

Bu bölümde sizlere yapmış olduğum şifre yöneticisi uygulaması anlatacağım.

İlk olarak uygulama açıldığında kayıt ekranı karşımıza çıkıyor. Bu kayıt ekranında belirlenen şifre ile daha sonraki girişlerimizde uygulamayı açıyoruz.

<img src="/images/sifre1.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Daha sonra giriş ekranı karşımıza çıkıyor. Burada ilk başta kayıt olurken girdiğimiz şifre ile uygulamayı açıyoruz.

<img src="/images/sifre2.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Daha sonra en alttaki menüden + butonuna tıklayarak yeni bir kategori ekleyebiliriz.

<img src="/images/sifre3.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Kategoriye basılı tutup seçtiğimizde arka planı beyaz oluyor ve seçilen kategorinin başında tik işareti çıkıyor.

Eklediğimiz kategoriyi düzenlemek veya silmek istersek en alttaki menüden düzenleme ve silme butonlarını kullanabiliriz. 

<img src="/images/sifre4.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Kategorinin üstüne tıkladığımızda da ilgili kategorinin içerisindeki şifre sayfası bizi karşılıyor, sağ alttaki + butonuna tıklayarak yeni bir şifre ekleyebiliriz.

<img src="/images/sifre5.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />    

Bu şekilde eklediğimiz şifreleri görüntüleyebiliyoruz. Burada sağ üstteki buton ile şifrelerimizi A'dan Z'ye veya Z'den A'ya sıralayabiliriz.

Ayrıca şifrelerimizin yanında gözüken ikonlar ile sırasıyla, şifreyi düzenleme, şifreyi kopyalama, şifreyi silme ve şifreleri kaydırarak sıralama işlemlerini yapabiliriz.

<img src="/images/sifre6.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Daha sonra ana sayfaya dönüp girdiğimiz verileri yedeklemek istersek en alttaki menüden yedekleme butonuna tıklayarak yedekleme ekranına geçebiliriz.

Burada bizden yedek dosyamız için bir şifre belirlememiz istenecek, şifreyi belirleyip yedekleme işlemini yapıyoruz.

Tüm yedekleme işlemlerimizi .json dosyası olarak yapıyoruz.

<img src="/images/sifre7.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />    

Yedekten verileri geri yüklemek istersek en alttaki menüden geri yükleme butonuna tıklayarak geri yükleme ekranını açıp yedek dosyamızı seçiyoruz.

Burada bizden yedek dosyamıza koyduğumuz şifreyi girmemiz istenecek, şifreyi girip yedekten veri çekme işlemini yapıyoruz.

<img src="/images/sifre8.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Son olarak şifremizi güncellemek istersek sol üst köşedeki ayarlar butonundan şifremizi güncelleyebiliriz.

Ayrıca sağ üstteki çıkış yap butonu ile uygulamamızı kapatabiliriz.

<img src="/images/sifre9.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />


> Uygulamanın tamamının kodlarını [buradan](https://github.com/B1L0CAN/Password-Manager-App-v2) inceleyebilirsiniz.

> Giriş çıkış sisteminin biraz daha farklı olduğu, yedeklemenin isim üzerinden gerçekleştiği ilk versiyona da [buradan](https://github.com/B1L0CAN/Password-Manager-App) ulaşabilirsiniz.

    `,

    lingo: `

# Lingo Oyunu

Bu kısımda kısa sürede yapmış olduğum basit bir lingo oyunu projesini göstereceğim :)

İlk olarak ana sayfa ile başlayalım.

<img src="/images/lingo1.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Görüleceği üzere ana sayfada sadece oyunun adı ve kaç harfli kelimeler ile oynamak istiyorsak onların butonu bulunuyor.

<img src="/images/lingo2.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

4 harfliler ile oyunu tanıtalım, ilk olarak ilgili harf kategorisinde eksik sayıda harf girişi yaptığımızda uygulamamız bize uyarı mesajı gösteriyor

<img src="/images/lingo3.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Aynı zamanda uygulamamız eğer kullanıcı kelimenin verilen ilk harfini yanlış girerse bu şekilde uyarı veriyor.

<img src="/images/lingo4.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Eklediğim ipucu butonu ile kullanıcı zorlandığı yerde kelimenin rastgele bir harfine ulaşabiliyor. İpucu butonu 10 puan eksiltiyor.

<img src="/images/lingo5.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Kelimeyi doğru bulduğumuzda bu şekilde custom toast mesajımız bize yeşil arka planla kazandınız mesajını veriyor. Aynı zamanda altındaki gizli buton oyun bittiğinde ortaya çıkıyor ve bir sonraki levele geçmemizi sağlıyor.

<img src="/images/lingo6.jpg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Kelimeyi bulamadığımızda ise custom toast mesajımız kırmızı arka planla bize bu şekilde kaybettiniz mesajı veriyor. Aynı zamanda aşağı taraftaki gizli textView'de doğru kelimeyi, gizli butonla da sonraki seviyeye geçme seçeneğini bize gösteriyor.

> Son olarak uygulamada bahsetmediğim bir puan sistemi de mevcut, ne kadar erken bilinirse o kadar çok puan geliyor, bilinemediğinde puan kırılıyor ve ipucu alımlarında 10 puan düşüyor.

- Güncelleme: 22.02.2025

Uygulamaya eğer kullanıcının puanı yetiyor ise bir hak daha verme özeliği eklendi.

Ayrıca artık puan yetmiyor ise kullanıcı ipucu alamayacak.

<img src="/images/lingo7.jpeg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />    

<img src="/images/lingo8.jpeg" width="260" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />    


> Uygulamanın tamamının kodlarını [buradan](https://github.com/B1L0CAN/LingoGame) inceleyebilirsiniz.
`,

sertifika: `

Bu kısımda Android ile ilgili sertifikalarımı paylaşacağım.

<img src="/images/sertifika1.png" width="750" height="450" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />    

<img src="/images/sertifika2.png" width="750" height="500" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />    

<img src="/images/sertifika3.png" width="750" height="500" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />    

BTK Akademi üzerinden "Kotlin ile Android Mobil Uygulama Geliştirme İleri Seviye" eğitimim devam ediyor :)


`,
notdefteri: `


Bu kısımda resimlere not eklemek için yaptığım uygulamayı göstereceğim.

İlk olarak uygulama açıldığında alert dialog ile bize bir bilgilendirme mesajı veriyor.

<img src="/images/not1.jpeg" width="270" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Anladım butonuna tıkladıktan sonra ana sayfadan + butonuna tıklayarak resim yükleme ekranına geçiyoruz.

<img src="/images/not2.jpeg" width="270" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

ImageView üstüne tıklayarak resim yükleme ekranına geçiyoruz. Bu kısımda bizden kullanıcı izni isteniyor.

<img src="/images/not3.jpeg" width="270" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

İzin verildiğinde ise resim yükleme ekranına geçiyoruz ve resmi yüklüyoruz. Ardından resme ait başlığı ve alacağımız notu yazıyoruz.

<img src="/images/not4.jpeg" width="270" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Görüleceği üzere resim artık başlığıyla beraber ana sayfamızda görünüyor.

<img src="/images/not5.jpeg" width="270" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Büyüteç ikonuna tıklayarak resmi büyütebiliriz.

<img src="/images/not6.jpeg" width="270" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Resim ekledikçe recyclerView ile beraber resimlerimiz listeleniyor.

<img src="/images/not7.jpeg" width="270" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Arama çubuğumuz ile de listemiz uzadığı zaman aradığımız resmi bulabiliyoruz.

<img src="/images/not8.jpeg" width="270" height="800" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

> Uygulamanın tamamının kodlarını [buradan](https://github.com/B1L0CAN/PictureNotebook) inceleyebilirsiniz.
`,


    room: `
# Room Nedir?

- Room, Android’de SQLite veritabanını daha kolay ve güvenli bir şekilde yönetmek için kullanılan bir kütüphane ve Android Jetpack bileşenidir.

## Room'un Avantajları:

- SQL kodlarını doğrudan yazmak yerine, Kotlin veya Java nesneleri üzerinden OOP ile veritabanı işlemleri gerçekleştirilir.

- DAO (Data Access Object) sayesinde karmaşık sorgular yerine doğrudan fonksiyonlar çağrılarak işlem yapılabilir.

- Veri değişkenleri anlık olarak takip edilebilir.
 
## Room Bileşenleri

### Entity

- Veritabanında saklanacak verilerin tanımlandığı sınıflardır.

- Her Entity, bir tabloya karşılık gelir.

- Primary key, foreign key, indexler gibi özellikler tanımlanabilir.

- Entity'lerin içerisinde \`@Entity\` ifadesi  kullanılır.

### DAO (Data Access Object)

- Veritabanı işlemlerini gerçekleştiren arabirimdir.

- SQL sorguları yerine, Kotlin/Java fonksiyonları ile veri ekleme, silme, güncelleme ve okuma işlemleri yapılır.

- Room, SQL hatalarını compile-time’da kontrol eder.

### Database (Veritabanı Erişim Katmanı)

- Room’un veritabanını yönettiği ana sınıftır.

- \`@Database\` ile tanımlanır.

- Entity ve DAO’lar burada bağlanır.

- Tek bir instance’ın kullanılmasını sağlamak için Singleton (Tekil Nesne) Tasarım Deseni uygulanır.

## Room'un Implementasyonu

> Not: Bu kısımda verilen kodlar için gerekli ve önerilen importları yapmayı unutmayınız.

app/build.gradle içindeki dependencies kısmına şu tanımlamaları yapıyoruz:

\`\`\`kotlin
def room_version = "2.6.1"

implementation "androidx.room:room-runtime:$room_version"
ksp "androidx.room:room-compiler:$room_version"
implementation "androidx.room:room-ktx:$room_version"
implementation 'io.reactivex.rxjava3:rxandroid:3.0.2'
implementation 'io.reactivex.rxjava3:rxjava:3.1.5'
implementation "androidx.room:room-rxjava3:$room_version"
\`\`\`

> Projede rxJava kullanıyorsak rxJava kütüphanesini de eklememiz gerekiyor.

### Entity Veri Modeli Oluşturma

Aşağıdaki Tarif sınıfı, yemek tariflerini saklamak için Room'un bir Entity (veri modeli) olarak tanımlanmıştır.

\`\`\`kotlin
@Entity
data class Tarif (

    @ColumnInfo(name= "isim")
    var isim : String,

    @ColumnInfo(name= "malzeme")
    var malzeme: String,

    @ColumnInfo(name= "gorsel")
    var gorsel: ByteArray

){

    @PrimaryKey(autoGenerate = true)
    var id = 0
}
\`\`\`

- @Entity: Tarif sınıfının Room veritabanında bir tablo olduğunu belirtir.

- @ColumnInfo(name = "isim"): isim adlı sütunun veritabanındaki adını belirtir.

- @PrimaryKey(autoGenerate = true): id sütunu otomatik olarak artırılan bir birincil anahtar (Primary Key) olarak belirlenmiştir. Biz uğraşmıyoruz artmasıyla falan.

- gorsel: ByteArray: Görseller, veritabanına ByteArray olarak kaydedilecektir. Görsellerin sayısal değer olarak tutulduğunu unutma.

### DAO Tanımlamaları

DAO (Data Access Object), veritabanına erişmek ve sorgular yapmak için kullanılır.

\`\`\`kotlin
@Dao
interface TarifDAO {

    @Query("SELECT * FROM Tarif")
    fun getAll(): Flowable<List<Tarif>>

    @Query("SELECT * FROM Tarif WHERE id = :id")
    fun findById(id: Int) : Flowable<Tarif>

    @Insert
    fun insert(tarif: Tarif): Completable

    @Delete
    fun delete(tarif: Tarif): Completable
}
\`\`\`

> @Dao: Bu arayüzün Room veritabanı için bir DAO olduğunu belirtir.

- @Query("SELECT * FROM Tarif"): Tüm tarifleri liste olarak döndürür.

- @Query("SELECT * FROM Tarif WHERE id = :3"): ID’ye göre tarif bulma işlemi yapar. Örnek olarak 3 numaralı tarifin detayını almak istediğimizde böyle kullanırız.

- @Insert:, @Delete, @Update falan SQLite kısmında işlendi.

> Flowable (RxJava3) kullanımı, veritabanı değişikliklerini anlık olarak takip etmemizi sağlar.

> Completable kullanımı, asenkron işlemler yaparken başarı veya hata durumunu yönetmemize olanak tanır.

### Veritabanı Sınıfı

\`\`\`kotlin
@Database(entities = [Tarif::class], version = 1)
abstract class TarifDatabase : RoomDatabase() {
    abstract fun tarifDao() : TarifDAO
}
\`\`\`

- @Database(entities = [Tarif::class], version = 1): Tarif tablosunu içeren bir veritabanı tanımladık.
- abstract fun tarifDao(): TarifDAO: TarifDAO nesnesine erişimi sağlar.
- RoomDatabase sınıfından türetilmiştir ve singleton pattern ile kullanılmalıdır.

### Room Veritabanını Başlatma

Veritabanını başlatmadan önce TarifDatabase ve TarifDAO nesnelerini tanımlamamız gerekiyor.

\`\`\`kotlin
private lateinit var db: TarifDatabase
private lateinit var tarifDao: TarifDAO
private val mDisposable = CompositeDisposable()
\`\`\`

- TarifDatabase ve TarifDAO nesneleri, Room veritabanına erişim için gereklidir.
- CompositeDisposable, RxJava ile asenkron işlemleri yönetmek için kullanılır.


- onCreate içerisinde veritabanını şöyle başlatıyoruz.

\`\`\`kotlin
db = Room.databaseBuilder(requireContext(), TarifDatabase::class.java, "Tarifler")
    .build()
tarifDao = db.tarifDao()
\`\`\`

- Room.databaseBuilder(...) → "Tarifler" adlı Room veritabanını oluşturur.
- tarifDao değişkeni üzerinden veritabanına erişebiliriz.

### CRUD İşlemleri

#### Ekleme İşlemi (Insert)

\`\`\`kotlin
val tarif = Tarif(isim = isim, malzeme = malzeme, gorsel = byteDizisi)
mDisposable.add(
    tarifDao.insert(tarif)
        .subscribeOn(Schedulers.io())  // İşlemi arka planda çalıştır
        .observeOn(AndroidSchedulers.mainThread())  // Sonucu ana thread’de işle
        .subscribe(this::handleResponseForInsertionAndDeletion)
)
\`\`\`

- tarifDao.insert(tarif): Yeni tarif ekler.
- subscribeOn(Schedulers.io()): Arka planda çalıştırır (UI thread’i meşgul etmez).
- observeOn(AndroidSchedulers.mainThread()): Sonucu ana thread’de işler, UI’yi güncelleyebiliriz.

#### Verileri Getirme (Read)

\`\`\`kotlin
private fun verileriAl() {
    mDisposable.add(
        tarifDao.getAll()
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(this::handleResponse)
    )
}
\`\`\`

- tarifDao.getAll(): Veritabanındaki tüm tarifleri getirir.
- subscribe(this::handleResponse): handleResponse() fonksiyonu, verileri UI içinde kullanmamızı sağlar.

#### ID’ye Göre Veri Getirme

\`\`\`kotlin
mDisposable.add(
    tarifDao.findById(id)
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe(this::handleResponse)
)
\`\`\`

- findById(id): ID’ye göre spesifik bir tarif getirir.

#### Güncelleme İşlemi (Update)

Güncelleme işlemi için önce silip, ardından ekleyebiliriz veya \`@Update\` ile güncelleme yapabiliriz.

\`\`\`kotlin
mDisposable.add(
    tarifDao.delete(secilenTarif!!)
        .andThen(tarifDao.insert(guncellenmisTarif)) // Önce sil, sonra ekle
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe(this::handleResponseForInsertionAndDeletion)
)
\`\`\`

- andThen(): Silme işlemi bittikten sonra ekleme işlemini yapar.

Eğer DAO’da @Update anotasyonu ile güncelleme desteği eklersek:

\`\`\`kotlin
@Update
fun updateTarif(tarif: Tarif): Completable
\`\`\`

\`\`\`kotlin
mDisposable.add(
    tarifDao.updateTarif(guncellenmisTarif)
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe()
)
\`\`\`

- updateTarif(), veritabanındaki kaydı günceller.

#### Veri Silme (Delete)

\`\`\`kotlin
if (secilenTarif != null) {
    mDisposable.add(
        tarifDao.delete(secilenTarif!!)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(this::handleResponseForInsertionAndDeletion)
    )
}
\`\`\`

- Seçilen tarif null değilse, silme işlemi bu şekilde gerçekleştirilir.

> Sonuç olarak 

- Room veritabanını başlattık.

- CRUD işlemlerini RxJava ile asenkron hale getirdik.

- Veri ekleme, okuma, güncelleme ve silme işlemlerini inceledik.

- Schedulers.io() ile işlemleri arka planda çalıştırdık.

# Room vs. SharedPreferences vs. SQLite

Bu üç veri saklama yöntemi, Android’de farklı amaçlarla kullanılır. Hangisini seçeceğin, uygulamanın ihtiyaçlarına bağlıdır.

## Room 

SQL veritabanını daha basit hale getirir. Çok sayıda veriyi yönetmek için kullanılır.

- SQLite’ın üzerine bir soyutlama katmanı ekler, daha kolay kullanımı bize sağlar.

- DAO (Data Access Object) ile güvenli ve optimize edilmiş sorgular sağlar.

- Asenkron işlem desteği sayesinde büyük veri işlemleri UI thread’i bloklamadan çalıştırılabilir.

- Otomatik SQL sorgusu oluşturma ve hata kontrolleri yapar.

> Karmaşık verileri ilişkisel bir şekilde saklamak ve verimli CRUD işlemleri yapmak gerektiğinde bu kullanılır, karmaşık ve çok sayıda veride kısaca.

## SharedPreferences

Küçük ve basit verileri (ayarlar, kullanıcı tercihleri gibi) saklamak için kullanılır.

- Anahtar-değer (key-value) mantığıyla çalışır.

- Genellikle boolean, int, float, String, Set<String> gibi basit verileri saklamak için uygundur.

- Veriler XML dosyalarında saklanır, ilişkisel veritabanı gibi karmaşık sorgular desteklenmez.

> Kullanıcı ayarları, tema tercihi, giriş bilgileri gibi basit ve hızlı erişilmesi gereken veriler için uygundur. Çok basit ve temel veriler tutulacaksa kullanılabilir. 

## SQLite 

Verileri tablo yapısında depolamak için kullanılır ve SQL sorgularıyla erişilir.

- Room’dan farklı olarak doğrudan SQL komutları yazmayı gerektirir.

- Manuel veritabanı yönetimi ve hata kontrolleri yapmak zorundasın.

- Performans açısından optimize edilmemiş olabilir ve hataya daha açıktır.

>  Eğer Room kullanmadan, tamamen manuel bir SQL yönetimi istiyorsan tercih edebilirsin. Ancak genellikle Room önerilir.

## Özet

- Basit ayarlar ve küçük veriler → SharedPreferences

- İlişkisel ve büyük veri yönetimi → Room

- SQL sorgularını doğrudan kullanmak istiyorsan → SQLite (ama Room daha kolay ve güvenli bir seçenek)

- Yani SharedPreferences günlük küçük veriler için, Room ise büyük ve ilişkisel veriler için en iyi seçenek. SQLite ise daha düşük seviyeli bir alternatif ama genellikle Room’un sunduğu avantajlar nedeniyle tercih edilmiyor.


    `,

    izinler: `


> Androidde kullanıcı izinleri ilk bakışta çok karışık gözükmektedir. Zamanla alışacağız. :)

> Not: Kullanıcı izinleri anlatımında kullanılan kodların tamamı bir YemekTarifi Projesinin kodlarıdır. 

- Kullanıcı izinleri gizlilik ve veri güvenliği açısından son derfece önemlidir.

- Kullanıcı izinleri runtime'da istenir, böylece uygulama bu özelliği kullanmak istediğinde sorularak gereksiz isteklerden sakınılır. 

İlk olarak uygulamanın hangi izinleri isteyeceğiniz belirtmemiz gerekiyor, Manifest dosyasında.

## Manifest ve Binding İşlemleri

Biz bu örnekte storage ve media izinlerini istiyoruz.

\`\`\`xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"></uses-permission>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"></uses-permission>
\`\`\`

Sonrasında binding işlemini yapıyoruz.

\`\`\`kotlin
private var _binding : FragmentTarifBinding?= null
private val binding get() = _binding!!

override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentTarifBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

override fun onDestroyView() {
    super.onDestroyView()
    _binding = null  // Bellek sızıntılarını önlemek için binding temizlenir.
}
\`\`\`

Şimdi launcher ve seçilen görsel ile ilgili tanımlamalarını yapıyoruz.

\`\`\`kotlin
private lateinit var permissionLauncher : ActivityResultLauncher<String>
private lateinit var activityResultLauncher: ActivityResultLauncher<Intent>
//------ 
private var secilenGorsel : Uri?= null
private var secilenBitmap : Bitmap?= null
\`\`\`

- permissionLauncher: Kullanıcıdan galeriye erişim izni istemek için kullanılır.

- activityResultLauncher: Kullanıcı bir görsel seçtiğinde, bu sonucu almak için kullanılır.

- secilenGorsel: Kullanıcının seçtiği resmin galeri içindeki yolunu (URI) tutar. URL gibi düşünülebilir.

- secilenBitmap: Kullanıcının seçtiği resmin bitmap formatını tutar. Yani görsel formatını tutar.

Şimdi onViewCreated fonksiyonunda butonların onClick özelliklerini bağlayıp, fragmentten gelen argümanın durumuna göre butonların aktifliklerini ayarlayıyoruz.

\`\`\`kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    binding.imageView.setOnClickListener { gorselSec(it) }
    binding.silButton.setOnClickListener { sil(it) }
    binding.kaydetButton.setOnClickListener { kaydet(it) }

    arguments?.let {
        val bilgi = TarifFragmentArgs.fromBundle(it).bilgi

        if (bilgi == "yeniMi?") {
            binding.silButton.isEnabled = false
            binding.kaydetButton.isEnabled = true
        } else {
            binding.silButton.isEnabled = true
            binding.kaydetButton.isEnabled = false
        }
    }
}
\`\`\`

  <img src="/images/izin1.png" width="376" height="600" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

- Görüleceği üzere henüz silinecek bir görsel olmadığı için sil butonu inaktif durumdadır.

## Android 13 ve Üzeri İçin

Şimdi kullanıcıdan galeriye ve dahili depolamaya erişim izni istemek için kod yazıyoruz. \`fun gorselSec (view: View)\`  fonksiyonunun içerisinde 

\`\`\`kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
\`\`\`

Bu kod ile Android 13 ve üzeri için (API 33 ve üstü) izin istemek için yazıyoruz, sonrasında

\`\`\`kotlin
if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {//Daha önceden izin alınmış mı kontrolü
\`\`\`

kodu ile birlikte daha önceden izin alınmış mı kontrolü yapıyoruz.

- ContextCompat.checkSelfPermission metodu, ilgili iznin READ_MEDIA_IMAGES durumunu döndürür.
 
- Eğer izin verilmişse direkt galeri açılır.

- Eğer izin verilmemişse, != PackageManager.PERMISSION_GRANTED döner ve sonraki adımlara geçilir

Sonraki adımda

\`\`\`kotlin
if(ActivityCompat.shouldShowRequestPermissionRationale(requireActivity(),Manifest.permission.READ_MEDIA_IMAGES))

    Snackbar.make(view, "Yemek görseli eklemek için galeri erişimi gerekmektedir.",Snackbar.LENGTH_INDEFINITE).setAction(
        "İzinver",View.OnClickListener {
            permissionLauncher.launch(Manifest.permission.READ_MEDIA_IMAGES)
        }).show()
\`\`\`

- shouldShowRequestPermissionRationale metodu, kullanıcının daha önce izin verip vermediğini kontrol eder.

- Eğer kullanıcı daha önce izin vermemişse true döner ve izin istemeden önce bir açıklama yapılır.

- Snackbar ile kullanıcıdan neden izin istediğimizi tekrar kullanıcıya söylüyoruz.

- Snackbar.LENGTH_INDEFINITE, long veya short gibi süreli değil.

<img src="/images/izin3.png" width="280" height="650" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

- Eğer kullanıcı daha önce izin ekranını hiç görmediyse false döner ve bir sonraki maddedeki kod ile direkt izin istenir.


\`\`\`kotlin
else {
    permissionLauncher.launch(Manifest.permission.READ_MEDIA_IMAGES)
}
\`\`\`

- Eğer kullanıcı daha önce izin ekranını hiç görmemişse veya direkt izin istememiz gerekiyorsa burada izin istemeye başlıyoruz.

<img src="/images/izin2.png" width="330" height="600" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

- Eğer kullanıcı izni zaten vermişse

\`\`\`kotlin
else {
    val intentToGalery = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
    activityResultLauncher.launch(intentToGalery)
}
\`\`\`


- Eğer kullanıcı izni zaten vermişse direkt galeriye gitmek için intent başlatılır.

- Intent.ACTION_PICK, kullanıcının galerisinden bir görsel seçmesini sağlar.

- MediaStore.Images.Media.EXTERNAL_CONTENT_URI, galeri içindeki görsellere erişmek için kullanılır.

- activityResultLauncher.launch(intentToGalery), sonucu almak için galeriye yönlendirir.

<img src="/images/izin4.png" width="430" height="270" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />


## Andorid 13 Altı İçin

- Aynı izinleri andorid 13 altı için farklı bir şekilde yapmamız gerekiyor.

- Andorid 13 altı için olan kısım öncekiyle aynı şekilde çalışıyor, tek fark Android 13 altındaki cihazlar için farklı bir izin (READ_EXTERNAL_STORAGE) kullanılıyor olması.

\`\`\`kotlin
else{

if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {//Daha önceden izin alınmış mı kontrolü

    if(ActivityCompat.shouldShowRequestPermissionRationale(requireActivity(),Manifest.permission.READ_EXTERNAL_STORAGE))
        Snackbar.make(view, "Yemek görseli eklemek için galeri erişimi gerekmektedir.",Snackbar.LENGTH_INDEFINITE).setAction(
        "İzinver",View.OnClickListener {
                    permissionLauncher.launch(Manifest.permission.READ_EXTERNAL_STORAGE)
                    }).show()
    else{
        permissionLauncher.launch(Manifest.permission.READ_EXTERNAL_STORAGE
    }
}
else {
    val intentToGalery = Intent(Intent.ACTION_PICK,MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
    activityResultLauncher.launch(intentToGalery)
    }
}
\`\`\`

## Diğer Kodlar

\`fun registerLauncher()\` fonksiyonuna şunları yazıyoruz:

\`\`\`kotlin
activityResultLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()){result ->
\`\`\`

- registerForActivityResult metodu, bir aktivite başlatıp sonucunu almak için kullanılır.

- ActivityResultContracts.StartActivityForResult() kullanarak, galeriye gitme işlemini başlatacak bir etkinlik oluşturuyoruz.

- { result -> ... } kısmı, galeri dönüş verisini yakalamak için tanımlanmış bir lambda fonksiyonu.

\`\`\`kotlin
if (result.resultCode == AppCompatActivity.RESULT_OK) {
    val intentFromResult = result.data
\`\`\`

- result.resultCode == AppCompatActivity.RESULT_OK → Kullanıcının başarılı bir şekilde bir resim seçip seçmediğini kontrol eder.

- result.data → Seçilen resmin verilerini içeren Intent nesnesini döndürür.

Seçilen resmi işleme ve gösterme işlemleri şu şekilde yapılır:

\`\`\`kotlin
if (intentFromResult != null) {
    secilenGorsel = intentFromResult.data // Bu bize verinin nerde kayıtlı olduğunu gösterir

    try {
        // SDK SÜRÜMÜ 28 VE ÜSTÜYSE ŞU, DEĞİLSE ŞU KONTROLÜ SAĞLA
        if (Build.VERSION.SDK_INT >= 28) {
            val source = ImageDecoder.createSource(
                requireActivity().contentResolver,
                secilenGorsel!!
            )
            secilenBitmap = ImageDecoder.decodeBitmap(source)
            binding.imageView.setImageBitmap(secilenBitmap)
        } else {
            secilenBitmap = MediaStore.Images.Media.getBitmap(
                requireActivity().contentResolver,
                secilenGorsel
            )
            binding.imageView.setImageBitmap(secilenBitmap)
        }
    } catch (e: IOException) {
        println(e.localizedMessage)
    }
}
\`\`\`

- intentFromResult != null → Eğer Intent içeriği boş değilse (null değilse), kullanıcının gerçekten bir resim seçtiğini gösterir.

- secilenGorsel = intentFromResult.data → Seçilen resmin URI’sini (content:// ile başlayan bir adres) alır.

> Android 9 ve üzeri için ImageDecoder.createSource() ile bir görüntü kaynağı oluşturulur, ImageDecoder.decodeBitmap() ile bu kaynak bir Bitmap olarak okunur.

> Andorid 9'dan eski sürümler için MediaStore.Images.Media.getBitmap() kullanılarak doğrudan Bitmap elde edilir.

> try-catch bloğunda Eğer URI geçersizse veya dosya okunamazsa, IOException fırlatılır ve hata mesajı konsola yazdırılır.

Son olarak da permissionLauncher değişkeninin tanımlanması gerekiyor.

\`\`\`kotlin
permissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()){result ->
\`\`\`

- Bu satır, kullanıcının bir izni verip vermediğini kontrol eden bir launcher (başlatıcı) kaydeder. Burada kullanılan ActivityResultContracts.RequestPermission() ile bir izin talebi yapılır.

- İzin talebi sonucu alındığında, result parametresi true (izin verildi) ya da false (izin verilmedi) değerini döner.

Sonrasında

\`\`\`kotlin
if (result){
    val intentToGalery = Intent(Intent.ACTION_PICK,MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
    activityResultLauncher.launch(intentToGalery)
}else {
    Toast.makeText(requireContext(),"İzin verilmedi",Toast.LENGTH_LONG).show()
}
} //ilk satırın süslü parantezi
\`\`\`

- Eğer izin verilirse galeriye gitmek için intent başlatılır.

- Eğer izin verilmezse Toast mesajı görüntülenir.

> Son olarak tanımladığımız bu registerLauncher fonksiyonunu onCreate fonksiyonunda çağırmamız gerekiyor.

\`\`\`kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    registerLauncher()
}
\`\`\`

Anlattığımız her şeyin tek parça halindeki kodu:

\`\`\`kotlin
package com.example.yemektarifleri

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.yemektarifleri.databinding.FragmentTarifBinding
import com.google.android.material.snackbar.Snackbar
import java.io.IOException

class TarifFragment : Fragment() {

    private var _binding: FragmentTarifBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var permissionLauncher: ActivityResultLauncher<String>
    private lateinit var activityResultLauncher: ActivityResultLauncher<Intent>
    private var secilenGorsel: Uri? = null
    private var secilenBitmap: Bitmap? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        registerLauncher()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentTarifBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.imageView.setOnClickListener { gorselSec(it) }
        binding.silButton.setOnClickListener { sil(it) }
        binding.kaydetButton.setOnClickListener { kaydet(it) }

        arguments?.let {
            val bilgi = TarifFragmentArgs.fromBundle(it).bilgi
            if (bilgi == "yeniMi?") {
                binding.silButton.isEnabled = false
                binding.kaydetButton.isEnabled = true
            } else {
                binding.silButton.isEnabled = true
                binding.kaydetButton.isEnabled = false
            }
        }
    }

    fun kaydet(view: View) {}

    fun sil(view: View) {}

    fun gorselSec(view: View) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                if (ActivityCompat.shouldShowRequestPermissionRationale(requireActivity(), Manifest.permission.READ_MEDIA_IMAGES)) {
                    Snackbar.make(view, "Yemek görseli eklemek için galeri erişimi gerekmektedir.", Snackbar.LENGTH_INDEFINITE)
                        .setAction("İzin ver") { permissionLauncher.launch(Manifest.permission.READ_MEDIA_IMAGES) }
                        .show()
                } else {
                    permissionLauncher.launch(Manifest.permission.READ_MEDIA_IMAGES)
                }
            } else {
                val intentToGalery = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
                activityResultLauncher.launch(intentToGalery)
            }
        } else {
            if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                if (ActivityCompat.shouldShowRequestPermissionRationale(requireActivity(), Manifest.permission.READ_EXTERNAL_STORAGE)) {
                    Snackbar.make(view, "Yemek görseli eklemek için galeri erişimi gerekmektedir.", Snackbar.LENGTH_INDEFINITE)
                        .setAction("İzin ver") { permissionLauncher.launch(Manifest.permission.READ_EXTERNAL_STORAGE) }
                        .show()
                } else {
                    permissionLauncher.launch(Manifest.permission.READ_EXTERNAL_STORAGE)
                }
            } else {
                val intentToGalery = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
                activityResultLauncher.launch(intentToGalery)
            }
        }
    }

    fun registerLauncher() {
        activityResultLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == AppCompatActivity.RESULT_OK) {
                val intentFromResult = result.data
                intentFromResult?.let {
                    secilenGorsel = it.data
                    try {
                        if (Build.VERSION.SDK_INT >= 28) {
                            val source = ImageDecoder.createSource(requireActivity().contentResolver, secilenGorsel!!)
                            secilenBitmap = ImageDecoder.decodeBitmap(source)
                            binding.imageView.setImageBitmap(secilenBitmap)
                        } else {
                            secilenBitmap = MediaStore.Images.Media.getBitmap(requireActivity().contentResolver, secilenGorsel)
                            binding.imageView.setImageBitmap(secilenBitmap)
                        }
                    } catch (e: IOException) {
                        println(e.localizedMessage)
                    }
                }
            }
        }

        permissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { result ->
            if (result) {
                val intentToGalery = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
                activityResultLauncher.launch(intentToGalery)
            } else {
                Toast.makeText(requireContext(), "İzin verilmedi", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}
\`\`\`

<img src="/images/izin5.png" width="380" height="600" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

- Görüleceği üzere tüm bu işlemlerin sonunda galerideki bir fotoğrafı uygualamaya başarılı bir şekilde ekledik.

## Androidde İzin Seviyeleri

- Android'de izin seviyeleri 3 farklı seviyeye ayrılır:

### Normal İzinler

- Normal izinler, kullanıcı gizliliği açısından tehlikeli olmayan izinlerdir. Bu izinler, genellikle cihazın temel işlevlerine erişim sağlar ve kullanıcıdan onay istenmez. Örneğin:

- Bu izinler, uygulama yüklendiğinde otomatik olarak verilmiş sayılır ve Android işletim sistemi tarafından kullanıcıya gösterilmeden uygulanır.

Örnek olarak, internet erişimi verilebilir.

### Tehlikeli (Dangerous) İzinler

- Tehlikeli izinler, kullanıcının kişisel bilgilerine, cihazın donanımına veya diğer hassas verilere erişim sağlar.

- Bu izinler, kullanıcının onayı gerektirir ve uygulama çalışırken izin isteme işlemi yapılır. Eğer kullanıcı izin verirse, uygulama ilgili kaynağa erişebilir.

- Bu tür izinler için kullanıcıya bir açıklama gösterilmesi gerekebilir.

Örnek olarak, kamera erişimi, konum erişimi, dosya erişimi verilebilir.

### Özel İzinler

- Android, bazı özel izinler için ek doğrulama gerektirebilir

Mesela, SYSTEM_ALERT_WINDOW, uygulamanın ekran üzerinde başka uygulamaların üstünde görünmesini sağlar (mesaj kutuları vb.).

### İzinler ile İlgili Ek Notlar

- Android 6.0 (API 23) ve sonrasında uygulama başlatıldığında izin istenmesi gerekir

- İzinler, kullanıcıya zorla kabul ettirilmeye çalışılır yoksa kullanamaz ama yine de bilgilendirilmesi gerekir :)

- Kullanıcı verdiği izinleri kaldırabilir.

- Eğer kullanıcı izin istemini reddederse, uygulama genellikle bir rationale (açıklama) göstermelidir. Bu açıklama, kullanıcıya izin istemenin nedenini ve bu iznin uygulamanın düzgün çalışması için ne kadar gerekli olduğunu anlatır. Örneğimizde var.


    `,


    sqlite: `

SQLite, Android’de local veritabanı işlemleri için kullanılan hafif bir veritabanıdır. Uygulamaya gömülüdür, yani ek bir sunucuya ihtiyaç duymaz.

> Bu kısımda sadece SQLite ile ilgili temel bilgiler olacaktır.

## SQLite Kullanımı

SQLite’yi kullanmak için öncelikle bir adet veritabanı oluşturmamız gerekiyor.

### Tablo Oluşturma

\`\`\`sql
CREATE TABLE IF NOT EXISTS oyunKatalogu (id INTEGER PRIMARY KEY, oyunIsmi VARCHAR, oyunFiyati INT);
\`\`\`

- Bu kod ile \`CREATE TABLE\` komutu ile oyunKatalogu adında bir tablo oluşturduk. 

- Tablomuzda id adında bir integer değişken oluşturduk ve primary key olarak belirledik. Bu değer kendi otomatik artarak devam eder.

- oyunIsmi adında bir string değişken oluşturduk. Oyun isimleri bu değişkende tutulacak.

- oyunFiyati adında bir integer değişken oluşturduk. Oyun fiyatları bu değişkende tutulacak.

- IF NOT EXISTS komutu ile bu isimde bir tablo zaten varsa oluşturma işlemini atlayacak.

### Tabloya Veri Ekleme ve Görüntüleme

Şimdi bu tabloya veri ekleyelim.

\`\`\`sql
INSERT INTO oyunKatalogu (oyunismi, oyunfiyati) VALUES ('Red Dead Redemption 2', 1500);
INSERT INTO oyunKatalogu (oyunismi, oyunfiyati) VALUES ('Elden Ring', 1200);
INSERT INTO oyunKatalogu (oyunismi, oyunfiyati) VALUES ('God of War', 1000);
INSERT INTO oyunKatalogu (oyunismi, oyunfiyati) VALUES ('PES 2013', 200);
INSERT INTO oyunKatalogu (oyunismi, oyunfiyati) VALUES ('Ghost of Tsushima', 750);
INSERT INTO oyunKatalogu (oyunismi, oyunfiyati) VALUES ('Counter Strike 2', 450); 
\`\`\`

- Into ile hangi tabloya ekleyeceğimizi, sonrasında hangi bileşenlere ekleyeceğimizi belirtiyoruz

- Values ile de ilgili değerleri ekliyoruz.

- SELECT komutu ile tablodaki verileri seçebiliyoruz. 

Şimdi bu verileri görüntüleyelim.

\`\`\`sql
SELECT * FROM oyunKatalogu;
\`\`\`  

- Yıldız operatörü tüm verileri seçmemizi, FROM ise hangi tablodan veri seçeceğimizi belirtir.

- Yıldız yerine isim yazsaydık sadece oyun isimlerini görüntülerdi.

Şu anda oluşan tablo bu şekilde:

<img src="/images/sqlite1.png" width="750" height="200" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

### Filtreleme

- WHERE komutu ile belirli bir şartı sağlayan verileri seçebiliyoruz.

\`\`\`sql
SELECT * FROM oyunKatalogu WHERE oyunfiyati = 1500;
\`\`\`

- WHERE komutu ile belirli bir şartı sağlayan verileri seçebiliyoruz.

- Mesela bu örnekte oyunKatalogu tablosundan oyunFiyatı = 1500 olan oyunları filtreledik.

<img src="/images/sqlite2.png" width="750" height="100" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

> isimden filtreleyecek olsaydık \`SELECT * FROM oyunKatalogu WHERE oyunismi = 'Red Dead Redemption 2';\` şeklinde yazardık.

#### Veri Filtrelemenin Alternatif Bir Yolu

\`\`\`sql
SELECT * FROM oyunKatalogu WHERE oyunismi LIKE 'G%';
\`\`\`

- LIKE komutu ile belirli bir içeriğe sahip verileri seçebiliyoruz.

- Mesela bu örnekte oyunKatalogu tablosundan oyunismi G ile başlayan oyunları filtreledik. Yani sonuç tablosunda God of War ve Ghost of Tsushima görünür.

> 'G%' ile G ile başlayan oyunları seçeriz. '%G' ile G ile biten oyunları seçeriz. '%G%' ile G içeren oyunları seçeriz.

### Veri Silme

- DELETE FROM komutu ile belirli bir şartı sağlayan verileri sileriz.

\`\`\`sql
DELETE FROM oyunKatalogu WHERE id=2;
\`\`\`

- Mesela bu örnekte id'si 2 olan Elden Ring oyununu sildik.

<img src="/images/sqlite3.png" width="750" height="170" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

### Veri Güncelleme

- UPDATE komutu ile belirli bir şartı sağlayan verileri güncelleriz.

 \`\`\`sql
 UPDATE oyunKatalogu SET oyunfiyati = 1050 WHERE oyunismi = 'Ghost of Tsushima';
\`\`\`

- Mesela bu örnekte oyunismi = 'Ghost of Tsushima' olan oyunun fiyatını 1050 olarak güncelledik.

<img src="/images/sqlite4.png" width="750" height="250" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

> Eğer WHERE filtreleme kodunu yazmasaydık tüm oyunların fiyatını 1050 olarak güncellerdi.

`,
    fragment: `
# Fragment 

- Fragment, Android'de ekranlar arası geçişleri sağlayan bir yapıdır. Fragmentler Aktivitelerin içinde yaşarlar.

- Aktivitelerden daha küçük ve verimli bir yapıdır.

- Aktiviteleri birden fazla fragment ile daha küçük parçalara bölerek daha verimli bir şekilde kullanabiliriz

- Örneğin 10 tane ekranı olan bir uygulamada 1 aktivite 10 fragment de yapabiliriz 2 aktivite 5 fragment de yapabiliriz.

İlk olarak fragment, navigation ve argumentler için gerekli \`safe arguments\` gradle modüllerini ekleyelim.

\`build.gradele.kts\` dosyasındaki \`pluginsin\` içine aşağıdaki kodu ekleyelim. (Proje klasörüne, module değil.)

\`\`\`gradle
id ("androidx.navigation.safeargs.kotlin") version "2.8.6" apply false
\`\`\`

Ardından da \`app\` klasöründe \`pluginsin\` içine aşağıdaki kodu ekleyelim.

\`\`\`gradle
id ("kotlin-kapt")
id ("androidx.navigation.safeargs.kotlin")
\`\`\`

Sonrasına da yine \`app\` klasöründe dependenciesin\` içine aşağıdaki kodu ekleyelim.

\`\`\`gradle
val nav_version = "2.8.6"

implementation("androidx.navigation:navigation-fragment-ktx:$nav_version")
implementation("androidx.navigation:navigation-ui-ktx:$nav_version")
\`\`\`

Bunun yerine Android Studio şunu öneriyor, eski versiyonu yok ise uygulamanın bu kullanılabilir: 

\`\`\`gradle
implementation(libs.androidx.navigation.fragment.ktx)
implementation(libs.androidx.navigation.ui.ktx)
\`\`\`

## Fragment Oluşturma ve Navigation Component Kullanımı

Öncelikle fragmentleri activity oluşturduğumuz yerin altından boş bir fragment olarak BirinciFragment ve IkinciFragment adında oluşturuyoruz.

Daha sonra fragmentlerin layoutlarını oluşturuyoruz.    

<img src="/images/fragment1.png" width="600" height="550" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Şimdi oluşturduğumuz bu fragmentleri navigation component ile bağlayacağız.

### Navigation Component Oluşturma ve Bağlantı

- Navigation Component, Android Jetpack'in bir parçasıdır.

> Not: Andorid Jetpack, modern android geliştirme için geliştirilmiş toplu bir kütüphanedir. Buna fragmentler de dahildir, navigationlar da dahildir vs vs.

Şimdi bu işi yapmak için \`res\` klasöründe yeni bir android source file açıp \`nav_graph.xml\` klasörünü oluşturuyoruz. Kaynak tipini \`Navigation\` seçiyoruz.

<img src="/images/fragment2.png" width="500" height="450" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Fragmentin birinden diğerine geçiş için bağlantı okunu bu şekilde oluşturuyoruz.

- Kırmızı kutudaki ev işareti başlangıç noktasını belirlemek için kullanılır.

## Fragmentlerin Kotlin Kısmı

Fragmentlerin viewBinding oluşturma şekli aktivitelere göre biraz farklıdır.

Öncelikle fragmentlerin içindeki gereksiz fonksiyonları kaldırıyoruz.

\`\`\`kotlin
class BirinciFragment : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
    }
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_blank, container, false)
    }
}
\`\`\`

Şimdi gerekli binding kodlarını ekleyelim. 

\`\`\`kotlin
private var _binding : FragmentBirinciBinding ?= null
private val binding get() = _binding!!
\`\`\`

Bunları en başa eklemeliyiz, sonrasında onCreateView fonksiyonunda binding yapmayı unutmuyoruz.

\`\`\`kotlin
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        //burada binding işlemini yapıyoruz.
        _binding = FragmentBirinciBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }
\`\`\`

Şimdi onViewCreated fonksiyonunu override etmeyi unutmamalıyız, gerekli işlem kodlarını da ekleyelim:

\`\`\`kotlin
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.editText.setText(" ")
        binding.button.setOnClickListener {
            sonraki(it) // onClick ile sonraki() fonksiyonuna bağlamayıp bura yazabilirdik buton kodlarını
        }
        //activity  veya app context veremiyoruz, fragmen içindeyiz, requirecontext yapmamız lazım
        Toast.makeText(requireContext(),"Hoşgeldiniz!",Toast.LENGTH_LONG).show()
    }

\`\`\`

> Fragment kullandığımız için Toast mesajı kısmında app veya activity context veremiyor, this falan kullanamıyoruz. Bunun yerine requireContext() kullanmalıyız.

BirinciFragment sayfasında son olarak onDestroyView fonksiyonunu override etmeyi unutmamalıyız.

\`\`\`kotlin
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
\`\`\`


## Argument Kullanımı

KullaniciIsmi adında bir argüman oluşturuyoruz, hangi fragmentte oluşturmak istiyorsak ona tıklayıp argüman oluştur diyoruz.

<img src="/images/fragment3.png" width="700" height="400" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

BirinciFragment sayfasındaki buton kodunu şu şekilde yazıyoruz.

\`\`\`kotlin
// Butonumuzun onClick özelliğini bağladığımız fonksiyon
fun sonraki (view : View){

    //yazı paslamak için aşağıdaki satır ve isim parametresini ekledik
    val isim = binding.editText.text.toString()

    // Action oluşturarak navigation işlemi ile sayfalar arasında geçiş yapıyoruz.
    val action = BirinciFragmentDirections.actionBirinciFragmentToIkinciFragment(isim)
    Navigation.findNavController(view).navigate(action)
}
\`\`\`

> \`BirinciFragmentDirections.actionBirinciFragmentToIkinciFragment\` kısmını biz ok çizince falan Android Studio otomatik oluşturuyor.

IkinciFragment sayfasında da aşağıdaki kodu ekleyelim.

\`\`\`kotlin

override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        arguments?.let {

            val isim = IkinciFragmentArgs.fromBundle(it).kullaniciIsmi

            binding.gelenIsim.text= isim // İlk fragmentteki editText'in içinden aldığımız yazıyı ikinci fragmentteki textView'e bağlıyoruz.
        }
    }
\`\`\`



> \`arguments?.let { }\` ile argümanın null olup olmadığını kontrol ederek alıyoruz. \`fromBundle(it)\` ile nereden aldığımızı belirtiyoruz.

Şimdi kodun uygulanmasını görelim.

<img src="/images/fragment4.png" width="600" height="400" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Uygulama başarılı bir şekilde çalışıyor. Birinci fragment sayfasında EditText'e bir değer yazıp butona tıkladığımızda bu metin ikinci fragment sayfasında yazdırılıyor.

## Yaşam Döngüsü Farkları

### Aktivite Yaşam Döngüsü

- onCreate(): Activity arka planda oluşturulur.
- onStart(): Kullanıcının göreceği şekilde uygulama başlatılır.
- onResume(): Kullanıcı uygulamayla etkileşime geçebilir.
- onPause(): Başka bir ekrana geçildiğinde çağrılır. Örnek, sekme sayfası.
- onStop(): Başka bir ekran açıldığında çağrılır. Örnek, ana ekrana döndüğümüzde.
- onDestroy(): Activity kaldırıldığında çağrılır, uygulama kapandığında yani.

### Fragment Yaşam Döngüsü

- onAttach(): Fragment, Activity'ye bağlanır.
- onCreate(): Fragment oluşturulur.
- onCreateView(): UI bileşenleri oluşturulur.
- onViewCreated(): View işlemleri burada yapılır.
- onStart(): Kullanıcının göreceği şekilde uygulama başlatılır.
- onResume(): Kullanıcı uygulamayla etkileşime geçebilir.
- onPause(): Başka bir ekrana geçildiğinde çağrılır. Örnek, sekme sayfası.
- onStop(): Başka bir ekran açıldığında çağrılır. Örnek, ana ekrana döndüğümüzde.
- onDestroyView(): View yok edilir, ancak Fragment hala vardır.
- onDestroy(): Fragment kaldırıldığında çağrılır.
- onDetach(): Activity ile bağlantısı kesilir.

\`Temel Farkları\`

- Activity tüm ekranı yönetir, Fragment bir Activity içinde çalışır.
- Fragment'in onCreateView() ve onViewCreated() gibi ekstra aşamaları vardır çünkü UI bileşenleri dinamik olarak oluşturulur.
- Fragment, Activity’den bağımsız olarak var olabilir ve yeniden kullanılabilir.
- Activity yaşam döngüsü tüm uygulamayı ilgilendirirken, Fragment yaşam döngüsü Activity’ye bağlıdır ve daha esnektir.

\`Neden Önemli?\`

\`\`\`kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.editText.setHint(" İsminizi giriniz")
}
\`\`\`

> Eğer biz bu kodu onViewCreated fonksiyonunda yazarsak, fragment oluşturulduğunda çağrılır.

> Ancak biz bu kodu onCreate fonksiyonunda yazmış olsaydık, uygulama ve aktivite başladığında çağrılacaktı. Fakat ortada henüz fragmentler için view yoktur. Bu yüzden ya hata alırız ya da istediğimiz işlemi yapamayız.

`,

    recyclerView: `

# RecyclerView Kullanımı

RecyclerView, Android'de liste veya ızgara (grid) şeklinde veri göstermek için kullanılan bir bileşendir. 

- Büyük listeleri daha verimli göstermek için (Bellek tasarrufu yapar).
- Daha esnek ve özelleştirilebilir.
- Eski ListView'den daha gelişmiş ve hızlıdır.

## Layout Kısmı

İlk olarak RecyclerView'i layouta ekleyelim.

<img src="/images/r1.png" width="700" height="450" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Ardından bir xml dosyası oluşturup  recyclerView için bir adet textView ekleyelim.

<img src="/images/r2.png" width="700" height="450" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Ardından da görüntülemek istediğimiz asıl bilgi sayfasını oluşturup layouta ekleyelim.

<img src="/images/r3.png" width="450" height="550" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

## Kotlin Kısmı

> İlk olarak view binding'i import etmeyi unutmamalıyız.

Şimdi bir adet SuperKahraman adında bir sınıf oluşturup içine isim, meslek, gorsel değişkenlerini ekleyelim.

\`\`\`kotlin
package com.example.superkahramankitabi

import java.io.Serializable

class SuperKahraman(val isim : String, val meslek: String, val gorsel: Int) : Serializable{
}
\`\`\`

> Not: Serializable sınıfından niçin kalıtım aldığımızı daha sonra göreceğiz.

> Not: gorsel değişkeni int olarak tanımlandı çünkü drawable resimleri hafızada int değerlere atıyor.

Şimdi MainActivity kısmına geçelim. 

### MainActivity Kısmı

Bir adet superKahramanListesi adında ArrayList oluşturalım, içeriğini daha sonra dolduracağız.
\`\`\`kotlin
private lateinit var superKahramanListesi : ArrayList<SuperKahraman>
\`\`\`

Şimdi onCreate fonksiyonunda superKahramanListesi'ne 4 adet SuperKahraman ekleyelim.

\`\`\`kotlin
    val superman = SuperKahraman("SuperMan","Gazeteci",R.drawable.superman)
    val batman = SuperKahraman("BatMan","Patron",R.drawable.batman)
    val ironman = SuperKahraman("IronMan","Zengin :D", R.drawable.ironman)
    val spiderman= SuperKahraman("SpiderMan","Fotoğrafçı",R.drawable.spiderman)

    // Şimdi bu nesneleri arrayList'e ekleyelim.
    superKahramanListesi = arrayListOf(superman,batman,ironman,spiderman)   
\`\`\`

### Adapter Kısmı

SuperKahramanAdapter adında bir sınıf oluşturup içine superKahramanListesi'ni ekleyelim.

> Not: Gerekli importları unutmamalıyız. \`Alt + Enter\` kombinasyonu ile import edebiliriz.

\`\`\`kotlin
class SuperKahramanAdapter(val SuperKahramanListesi: ArrayList<SuperKahraman>): RecyclerView.Adapter<SuperKahramanAdapter.SuperKahramanViewHolder>() {

    class SuperKahramanViewHolder(val binding: RecyclerRowBinding) : RecyclerView.ViewHolder(binding.root){


    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SuperKahramanViewHolder {
        val binding = RecyclerRowBinding.inflate(LayoutInflater.from(parent.context),parent,false)
        return SuperKahramanViewHolder(binding)
    }

    override fun getItemCount(): Int {
       return SuperKahramanListesi.size
    }

    override fun onBindViewHolder(holder: SuperKahramanViewHolder, position: Int) {
        holder.binding.textViewRecyclerView.text= SuperKahramanListesi[position].isim

        holder.itemView.setOnClickListener {
            val intent = Intent(holder.itemView.context, TanitimAktivitesi::class.java)
            intent.putExtra("secilenKahraman", SuperKahramanListesi[position])
            holder.itemView.context.startActivity(intent)
        }
    }
}
\`\`\`

> Not: intent içinde this yerine holder.itemView.context kullanmalıyız.

> Not: \`startactivity(intent)\` yerine \`holder.itemView.context.startActivity(intent)\` kullanmalıyız.

Şimdi MainActivity'e geri dönüp adapter'ı bağlayalım.

\`\`\`kotlin
    val adapter = SuperKahramanAdapter(superKahramanListesi)

    binding.RecyclerView.layoutManager = LinearLayoutManager(this)

    binding.RecyclerView.adapter= adapter
\`\`\`

> Not: LinearLayoutManager ile liste görünümü yapıyoruz. Eğer ızgara görünümü istiyorsak GridLayoutManager kullanmalıyız.

### Tanıtım Aktivitesi Kısmı

Tanıtım Aktivitesi sınıfını oluşturup bunun için de ayrı bir view binding tanımlaması yapıyoruz.

Ardından adapter kısmını tanıtım aktivitesi'ne bağlıyoruz.

\`\`\`kotlin
val secilenKahraman = adapterdenGelenIntent.getSerializableExtra("secilenKahraman") as SuperKahraman
\`\`\`

> Not: Bu kullanım ileride kalkacak, yerini şu kullanıma bıracak. 

\`\`\`kotlin
val secilenKahraman = adapterdenGelenIntent.getSerializableExtra("secilenKahraman",SuperKahraman::class.java)
\`\`\`

> Not: Bu kullanım şu an için sadece API 33 ve üstünde çalışıyor.

Son olarak da resim, isim ve meslek değişkenlerini bağlıyoruz.

\`\`\`kotlin
    binding.imageView.setImageResource(secilenKahraman.gorsel)
    binding.textView.text= secilenKahraman.isim
    binding.textView2.text= secilenKahraman.meslek
\`\`\`

Şu anda uygulamamız şu şekilde görünüyor ve çalışıyor: 

<img src="/images/r4.png" width="460" height="580" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

İlgili süper kahramanı seçtiğimizde şu şekilde görünüyor:

<img src="/images/r5.png" width="760" height="500" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

### Singleton Kullanımı

Son olarak da singleton kullanımını görelim.

Singleton, tek bir nesne oluşturup her yerde bu nesneyi kullanmak için kullanılır.

Eğer bu projede singleton kullanmak isteseydik: 

- Öncelikle MySingleton adında bir object oluşturuyoruz.

\`\`\`kotlin
object MySingleton {
    var secilenSuperKahraman : SuperKahraman ?= null
}
\`\`\`

- Sonrasında superKahramanAdapter sınıfında  

\`\`\`kotlin
intent.putExtra("secilenKahraman", SuperKahramanListesi[position])
\`\`\`
satırı yerine 

\`\`\`kotlin
MySingleton.secilenSuperKahraman=SuperKahramanListesi[position]
\`\`\`
satırını eklememiz gerekiyor.

- Ardından da Tanıtım Aktivitesi'nde 

\`\`\`kotlin
    val secilenKahraman = adapterdenGelenIntent.getSerializableExtra("secilenKahraman") as SuperKahraman
        binding.imageView.setImageResource(secilenKahraman.gorsel)
        binding.textView.text= secilenKahraman.isim
        binding.textView2.text= secilenKahraman.meslek
\`\`\`

kısmı yerine 

\`\`\`kotlin
val secilenKahraman= MySingleton.secilenSuperKahraman 
    secilenKahraman?.let {
        binding.imageView.setImageResource(secilenKahraman.gorsel)
        binding.textView.text= secilenKahraman.isim
        binding.textView2.text= secilenKahraman.meslek
        }
\`\`\`

yazmamız gerekiyordu.

> Not: let ile Nullable kontrolü yapıyoruz çünkü secilenKahraman null olabilir.

    `,

    hesapMakinesi: `
    
Merhaba, bu kısımda çok basit bir hesap makinesi projesi yapacağız. Proje bile denmeyecek kadar basit :) Amaç öğrendiklerimi tekrar etmek.

> Bu tarz bir hesap makinesi yapmanın çok fazla yolu var, bu yazıda çok çok basit şekilde bir hesap makinesi yapacağız.

## Layout ve XML Kısmı

İlk olarak Düzen kısmıyla başlayalım.

Basit olsun diye constraintLayout kullandım ben, buton kısımları iç içe olacak şekilde LinearLayout kullanılarak falan da yapılabilirdi..

<img src="/images/hesapMakinesi1.png" width="600" height="550" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

> Sayıları almak için plainText yerine direkt number komponentini koyuyoruz. Böylece sayı klavyesi açılacak.

> Butonlarımızın onClick özelliğini MainActivity'deki fonksiyonlara bağlayacağız. İsimlerini toplama, cikarma, carpma ve bolme olarak belirledik.

Şimdi xml kısmını yazalım.

\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <Button
        android:id="@+id/button"
        android:layout_width="70dp"
        android:layout_height="56dp"
        android:layout_marginStart="16dp"
        android:layout_marginTop="32dp"
        android:onClick="toplama"
        android:text="+"
        android:textSize="24sp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/editTextNumber2" />

    <Button
        android:id="@+id/button2"
        android:layout_width="70dp"
        android:layout_height="56dp"
        android:layout_marginStart="32dp"
        android:onClick="cikarma"
        android:text="-"
        android:textSize="24sp"
        app:layout_constraintStart_toEndOf="@+id/button"
        app:layout_constraintTop_toTopOf="@+id/button" />

    <Button
        android:id="@+id/button3"
        android:layout_width="70dp"
        android:layout_height="56dp"
        android:layout_marginEnd="32dp"
        android:onClick="carpma"
        android:text="*"
        android:textSize="24sp"
        app:layout_constraintEnd_toStartOf="@+id/button4"
        app:layout_constraintTop_toTopOf="@+id/button2" />

    <Button
        android:id="@+id/button4"
        android:layout_width="70dp"
        android:layout_height="56dp"
        android:layout_marginEnd="16dp"
        android:onClick="bolme"
        android:text="/"
        android:textSize="24sp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="@+id/button" />

    <TextView
        android:id="@+id/textView"
        android:layout_width="317dp"
        android:layout_height="64dp"
        android:layout_marginTop="50dp"
        android:text="SONUÇ:"
        android:textAlignment="center"
        android:textSize="24sp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/button2" />

    <EditText
        android:id="@+id/editTextNumber"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="50dp"
        android:ems="10"
        android:hint="İlk sayıyı giriniz"
        android:inputType="number"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <EditText
        android:id="@+id/editTextNumber2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="24dp"
        android:ems="10"
        android:hint="İkinci sayıyı giriniz"
        android:inputType="number"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/editTextNumber" />

</androidx.constraintlayout.widget.ConstraintLayout>
\`\`\`

## MainActivity.kt Kısmı

İlk olarak işe başlamadan önce view binding'i import ettik.

Ardından verimliliği arttırmak adına sayi1, sayi2 ve sonuc değişkenlerini sınıfın başında tanımladık, bu şekilde her fonksiyonda kullanabiliriz.

\`\`\`kotlin
var sayi1: Double ?= null
var sayi2: Double ?= null
var sonuc: Double ?= null
\`\`\`

Şimdi toplama,cikarma,carpma ve bolme fonksiyonlarını yazalım.

\`\`\`kotlin
 fun toplama (view: View){
        sayi1= binding.editTextNumber.text.toString().toDoubleOrNull()
        sayi2= binding.editTextNumber2.text.toString().toDoubleOrNull()

        if(sayi1!= null && sayi2 !=null){
            sonuc = sayi1!!+sayi2!!
            binding.textView.text= "Sonuc: {sonuc}"// Süslü parantezden önceki $ işareti silindi.
        } else{
            Toast.makeText(this@MainActivity,"Sayı kutucuğu boş bırakılamaz",Toast.LENGTH_LONG).show()
        }
    }

    fun cikarma (view: View){

        sayi1= binding.editTextNumber.text.toString().toDoubleOrNull()
        sayi2= binding.editTextNumber2.text.toString().toDoubleOrNull()

        if(sayi1!= null && sayi2 !=null){
            sonuc = sayi1!!-sayi2!!
            binding.textView.text= "Sonuc: {sonuc}"// Süslü parantezden önceki $ işareti silindi.
        } else{
            Toast.makeText(this@MainActivity,"Sayı kutucuğu boş bırakılamaz",Toast.LENGTH_LONG).show()
        }
    }

    fun carpma (view: View){

        sayi1= binding.editTextNumber.text.toString().toDoubleOrNull()
        sayi2= binding.editTextNumber2.text.toString().toDoubleOrNull()

        if(sayi1!= null && sayi2 !=null){
            sonuc = sayi1!!*sayi2!!
            binding.textView.text= "Sonuc: {sonuc}" // Süslü parantezden önceki $ işareti silindi.
        } else{
            Toast.makeText(this@MainActivity,"Sayı kutucuğu boş bırakılamaz",Toast.LENGTH_LONG).show()
        }
    }

    fun bolme (view: View){

        sayi1= binding.editTextNumber.text.toString().toDoubleOrNull()
        sayi2= binding.editTextNumber2.text.toString().toDoubleOrNull()

        if(sayi1!= null && sayi2 !=null){
            sonuc = sayi1!!/sayi2!!
            binding.textView.text= "Sonuc: {sonuc}" // Süslü parantezden önceki $ işareti silindi.
        } else{
            Toast.makeText(this@MainActivity,"Sayı kutucuğu boş bırakılamaz",Toast.LENGTH_LONG).show()
        }
    }
\`\`\`

> Eğer boş kutucuk bırakılırsa Toast mesajında "Sayı kutucuğu boş bırakılamaz" mesajı görüntülenir.

<img src="/images/hesapMakinesi2.png" width="700" height="170" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />


    `,
    sharedPreferences: `

## SharedPreferences Kullanımı

SharedPreferences, uygulamanın verilerini saklamak ve okumak için kullanılan bir yöntemdir. Bu veriler, uygulama kapatılsa dahi hafızada saklanır.

Mesela basit bir oyun uygulamasında maksimum skoru saklamak için kullanılır.

Basit işler için uygundur, daha kapsamlı ve karmaşık şeyler için veri tabanı kullanılır.

Örneğin daha sonra değer atayacağımız bir sharedPreferences değişkeni oluşturarak başlaylaım.

\`\`\`kotlin
    lateinit var sharedPreferences: SharedPreferences
\`\`\`

Ardından onCreate fonksiyonunda sharedPreferences'i initialize ediyoruz.

> onCreate fonksiyonu içinde initilize etmek önemli çünkü eğer önceden elimizde veri varsa program başlar başlamaz gözükmeli.

\`\`\`kotlin
sharedPreferences = this.getSharedPreferences("com.example.sharedpreferences",MODE_PRIVATE)
\`\`\`

> Mode_private ile sadece bu uygulama için erişilebilir hale getiriyoruz. Eğer bu uygulamadaki veriler başka bir uygulamada kullanılacak olsaydı MODE_WORLD_READABLE kullanılırdı.

%99 private kullanılır.

Şimdi aşağıdaki resimde bulunan uygulamanın kodunu yazalım.

<img src="/images/sharedui.png" width="750" height="350" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

### Kaydet Butonu
İlk olarak kaydet butonumuzun onClick özelliğini kaydet butonuna bağlıyoruz.

\`\`\`kotlin
    fun kaydet (view: View){

        val kullaniciGirdisi = binding.editText.text.toString()
        if (kullaniciGirdisi == ""){
            Toast.makeText( this@MainActivity,"İsim boş olamaz",Toast.LENGTH_SHORT).show()
        }else{
            sharedPreferences.edit().putString("isim", kullaniciGirdisi).apply()
            binding.textView.text="Kaydedilen İsim: {kullaniciGirdisi}" //Süslü parantezden önce $ işareti olmalıdır.
        }
    }
\`\`\`

<img src="/images/sharednoisim.png" width="350" height="850" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Görüleceği üzere isim girilmediğinde Toast mesajı görüntülenir ve "İsim boş olamaz" yazısı görüntülenir.

<img src="/images/sharedyesisim.png" width="550" height="450" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Görüleceği üzere isim girildiğinde textView'de "Kaydedilen İsim: {kullaniciGirdisi}" yazısı görüntülenir.

Şimdi bu kayıt gerçekten sharedPreferences'de saklanıyor mu kontrol edelim, uygulamayı kapatıp tekrar açalım.

<img src="/images/shareddbkontrol.png" width="570" height="450" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Görüleceği üzere hafızada isim var olduğu için "Kaydedilen İsim: Bilocan" yazısı görüntülenir.

### Silme Butonu

Şimdi silme butonumuzun kodunu yazacağız, ondan önce onCreate fonksiyonunda bir değişken oluşturacağız.

\`\`\`kotlin
    alinanKullaniciAdi = sharedPreferences.getString("isim","")
        if(alinanKullaniciAdi==""){
            binding.textView.text= "Daha önce girilen bir isim yok."
        }else{
            binding.textView.text = "Kaydedilen İsim: {alinanKullaniciAdi}"//Süslü parantezden önce $ işareti olmalıdır.
        }
\`\`\`

> Bu kodda sharedPreferences'deki isim değişkenini alıyoruz ve eğer boş ise "Daha önce girilen bir isim yok." yazısı görüntülenir, eğer dolu ise "Kaydedilen İsim: {alinanKullaniciAdi}" yazısı görüntülenir.

> getString fonksiyonu ile sharedPreferences'deki isim değişkenini alıyoruz. "isim" değişkeni aynı olmalı dikkat et, ikinci parametre de default değerdir.

"isim" değişkeninde bir değer bulamaz ise defaulta bakar, defaulta "herhangi bir değer yok" yazılabilir mesela.
Şimdi silme butonumuzun onClick özelliğini sil fonksiyonuna bağlıyoruz ve kodunu yazıyoruz.

\`\`\`kotlin
    fun sil (view : View){
        alinanKullaniciAdi = sharedPreferences.getString("isim", "")
        if (alinanKullaniciAdi != "") {
            sharedPreferences.edit().remove("isim").apply()
            binding.textView.text = "İsim silindi."
        } else {
            binding.textView.text = "Daha önce girilen bir isim yok."
        }
    }
\`\`\`

<img src="/images/sharedsilisim.png" width="570" height="450" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Görüleceği üzere sil butonuna bastığımızda "İsim silindi." yazısı görüntülenir ve hafızadan Bilocan yazısı silinir.

Şimdi hafızada isim var mı yok mu kontrol edelim, uygulamayı kapatıp tekrar açalım.

<img src="/images/sharedson.png" width="570" height="450" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Görüleceği üzere hafızada isim kalmadığı için "Daha önce girilen bir isim yok." yazısı görüntülenir.

    `,
    context: `

## Activity Context

Activity Context, yalnızca ilgili aktiviteye bağlı olan bağlamdır. UI bileşenleriyle (AlertDialog, Toast, Intent vb.) etkileşim için kullanılır.

> İlgili kütüphanesini import etmemiz gerekiyor, \`import android.widget.Toast\`. Ayrıca \`show()\` fonksiyonunu da görüntülemek için çağırmamız gerekiyor.

\`\`\`kotlin
Toast.makeText(this@MainActivity,"Uygulamaya Hoşgeldiniz",Toast.LENGTH_LONG).show()
\`\`\`

> Bu kodda this@MainActivity yerine sadece this yazabiliriz ama alışmak için this@MainActivity daha iyi olur çünkü bazı kullanımlarda sadece this yeterli olmuyor.
## App Context

App Context, uygulamanın genel yaşam döngüsüne bağlı, tüm uygulama boyunca geçerli olan bağlamdır. Genellikle servisler, bildirimler veya uzun ömürlü işlemler için kullanılır.

\`\`\`kotlin
Toast.makeText(applicationContext,"Uygulamaya Hoşgeldiniz",Toast.LENGTH_LONG).show()
\`\`\`

<img src="/images/toast.png" width="350" height="750" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

> Görüleceği üzere iki türlü de ekranın aşağısında Toast mesajımız görüntülendi.

## Alert Dialog Kullanımı

Alert Dialog, uygulamanın kullanıcıya önemli bilgiler vermek veya onay istemek için kullanılan bir yöntemdir. 

Yukarıda resmi olan örnekte Kaydet butonuna tıklandığında Alert Dialog görüntülemek için adını kaydet koyduğumuz onClick fonksiyonunu şu şekilde tanımlayabiliriz:

\`\`\`kotlin
val alert = AlertDialog.Builder(this@MainActivity) //applicationContext olsa hata vercekti
    alert.setTitle("Kayıt Edilecek")
    alert.setMessage("Kayıt işlemini yapmak istediğinize emin misiniz?")
\`\`\`

<img src="/images/alertDialog.png" width="650" height="250" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

> Bu kodda AlertDialog.Builder fonksiyonunu kullanarak AlertDialog oluşturuyoruz ve başarılı bir şekilde AlertDialog görüntülendi.

Şimdi bu pencereye buton ekleyerek işlemleri tamamlayalım. Basılan butona göre aşağıda bir toast mesajı görüntüleyelim.

\`\`\`kotlin
alert.setPositiveButton("Evet") { dialog, which ->
           Toast.makeText(this@MainActivity,"Kayıt Tamamlandı", Toast.LENGTH_LONG).show()
        }
\`\`\`

> Bu şekilde de buton kodunu yazabiliriz şu şekilde obeject sınıfından türeterek de: 

\`\`\`kotlin
alert.setNegativeButton("Hayır" , object : DialogInterface.OnClickListener{
    override fun onClick(dialog: DialogInterface?, which: Int) {
        Toast.makeText(this@MainActivity,"Kayıt Yapılmadı", Toast.LENGTH_LONG).show()
        } 
})
\`\`\`

> Dikkat: Bu kod kullanımında this@MainActivity yazmamız gerekiyor, sadece this yazarsak hata verir.

Artık butonlarımızı ekledik ve alert dialogumuzda gözükecek.

<img src="/images/button.png" width="650" height="250" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />

Şimdi yazdığımız koda göre evete bastığımızda "Kayıt Tamamlandı", hayıra bastığımızda "Kayıt Yapılmadı" mesajı görüntüleniyor.

<img src="/images/yesorno.png" width="650" height="750" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />



    `,
    intent: `

## Intent Kullanımı

Intent, bir uygulamanın başka bir uygulamaya veri göndermek veya bir uygulamadan diğer bir uygulamaya geçiş yapmak için kullanılan bir yöntemdir.

\`android.content.Intent\` kütüphanesini import etmemiz gerekiyor. Ayrıca binding importunu da unutmamalıyız.

Örnek olarak bir uygulama içerisinde bir butona tıklandığında başka bir uygulamaya geçiş yapmak için kullanılır.

\`\`\`kotlin
fun sonrakiSayfa (view : View) {
    val intent = Intent(this,SecondActivity::class.java) //this@MainActivity de olabilirdi
    val kullaniciGirdisi= binding.editTextText2?.text.toString()
    intent.putExtra("isim", kullaniciGirdisi)
    startActivity(intent)
}
\`\`\`

> Bu kodda MainActivity sınıfından SecondActivity sınıfına geçiş yapıyoruz. Bunu yaparken mainActivity'deki butonun onClick özelliğini sonrakiSayfa fonksiyonuna bağlıyoruz.

Ayrıca bu geçişi yaparken mainActivity'deki editTextText2'deki metni de SecondActivity'ye gönderiyoruz. Yani mainActivity'de yazılan bir metni SecondActivity'de görüntüleyeceğiz.

Bu işlem için \`putExtra\` fonksiyonunu kullanıyoruz.

\`\`\`kotlin
binding.SecondPageText.text= intent.getStringExtra("isim")

/*
Olayı  anlamak için şu şekilde yapılıyor işlemler aslında, biz bunu tek satırda hallettik.
val maindenGelenIntent = intent
    val yollananIsim = maindenGelenIntent.getStringExtra("isim")
    binding.SecondPageText.text= yollananIsim
*/
\`\`\`

> Bu kodda SecondActivity'deki SecondPageText'e mainActivity'deki editTextText2'deki metni gönderiyoruz.

- Hem sayfa geçişi hem de veri gönderimi sağladığımız örnek uygulama:

<img src="/images/intent.png" width="500" height="300" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />


`,
    yasamDongusu: `

# Yaşam Döngüsü Fonksiyonları 

Bir android uygulamasının çalıştığı süreçte 6 farklı fonksiyon çalışır. Bu fonksiyonların her biri belirli bir amaçla kullanılır.

- onCreate()
- onStart()
- onResume()
- onPause()
- onStop()
- onDestroy()

> Burada yazan açıklamaların hepsini kendi hatırlayacağım şekilde yazdığımı hatırlatmak isterim :)
 
## onCreate()

Bu fonksiyon, uygulama ilk çalıştığında çalışır. Bu fonksiyon içerisinde uygulamanın başlangıç ayarlarını yaptığımız fonksiyondur.

\`\`\`kotlin
override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        val view = binding.root
        setContentView(view)
        enableEdgeToEdge()
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
    }
\`\`\`

> Program ilk açılacağı zaman çalışacak kodlar buraya yazılır. Program kapatılıp tekrar açılıncaya kadar çalışmayacağı için başlangıçta lazım olan tüm kodlar buraya yazılır.

## onStart()

Bu fonksiyon, Aktivite ekranda görünmeye başladığı anda çalışır. Bir nevi onCreate ile onResume arasında köprü görevi görür.

\`\`\`kotlin
override fun onStart() {
    super.onStart()
    // Buraya kodlar yazılır.
}
\`\`\`

## onResume()

Bu fonksiyon, uygulama kullanıcıyla etkileşime geçmeye hazır olduğunda çağrılır. Kullanıcı genellikle bu fonksiyon çalışırken uygulamayı kullanır.

\`\`\`kotlin
override fun onResume() {
    super.onResume()
    // Buraya kodlar yazılır.
}
\`\`\`

## onPause() 

Bu fonksiyon, aktivite başka bir pencere tarafından kısmen kapatıldığında çalışır. Yani çalışan uygulamada sekme menüsüne geçildiğinde çalışır.

\`\`\`kotlin
override fun onPause() {
    super.onPause()
    // Buraya kodlar yazılır.
}
\`\`\`

## onStop()

Bu fonksiyon, aktivite tamamen ekrandan kaybolduğunda çağrılır. Yani uygulamayı alta aldığımızda çalışır.

\`\`\`kotlin
override fun onStop() {
    super.onStop()
    // Buraya kodlar yazılır.
}
\`\`\`


## onDestroy()

Bu fonksiyon, aktivite tamamen kapatıldığında çalışır. Yani uygulamayı tamamen kapattığımızda, uygulamadan çıktığımızda çalışır ve işlemler sonlandırılır.

\`\`\`kotlin
override fun onDestroy() {
    super.onDestroy()
    // Buraya kodlar yazılır.
}
\`\`\`

# Ek Notlar

> Not: onCreate ile onDestroy arasında köprü görevi gören fonksiyonlar da vardır. Bunlar da onRestart() ve onSaveInstanceState() fonksiyonlarıdır.

### onRestart()

Bu fonksiyon, aktivite stop edildikten sonra tekrar başlatıldığında çalışır.
\`\`\`kotlin
override fun onRestart() {
    super.onRestart()
    // Buraya kodlar yazılır.
}
\`\`\`

Yani onStop ile onStart arasında köprü görevi görür. Uygulama durdurulduğunda tekrar çalışacak hale getirilmesi için onRestart çalıştırılır.

### onSaveInstanceState()

Bu fonksiyon, uygulamanın durumu değiştiğinde (örneğin, ekran döndüğünde veya sistem bellek boşaltırken aktiviteyi kapattığında) verileri kaydetmek için kullanılan bir fonksiyondur.

\`\`\`kotlin
override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState) 
    outState.putString("oyunDurumu", "RDR2 iyi bir oyun") // Veriyi kaydediyoruz
}

override fun onRestoreInstanceState(savedInstanceState: Bundle) {
    super.onRestoreInstanceState(savedInstanceState)
    val durum = savedInstanceState.getString("oyunDurumu")
    binding.textView2.text = "Sonuç: $durum" // Veriyi geri yüklüyoruz
}
\`\`\`

> Not: Bu fonksiyon, bir Bundle içine geçici verileri kaydeder ve uygulama tekrar açıldığında onCreate() veya onRestoreInstanceState() ile geri yüklenir.

    `,
    xmlkotlin: `
Bu kısımda layouttaki bileşenlerimizin kodlarını kotlinde düzenlemeyi öğreneceğiz

## findViewById Kullanımı

Önceki sayfada yer alan xml kodundaki bileşenlerin özelliklerini kotlinde değiştirebiliriz.

Örneğin:

\`\`\`kotlin
    var image = findViewById<ImageView>(R.id.imageView)
        //Bu şekilde projedeki id'si imageView olan bileşene ulaşıp üzerinde değişiklikler yapabiliriz
        //image. yaparak ilgili fonksiyonlar ile birlikte resmin bilgilerini güncelleyebiliriz. Mesela image.top

    val text = findViewById<TextView>(R.id.textView)
        //text.text = "Red Dead Redemption 2"  yaparsak önceki sayfadaki RDR 2 yazısı Red Dead Redemption 2 yazısına dönüşür.
\`\`\`

> Fakat bu yöntem çok kullanışlı değildir çünkü hem karmaşıklık açısından hem de kullanım açısından kötüdür. Her değişecek değişecek bileşen için ayrı değişken tanımlama falan oohooo.
 
Bunun yerine viewBinding kullanılır.

## viewBinding Kullanımı

viewBinding, layouttaki bileşenlerin kodlarını kotlinde düzenlemeyi sağlayan bir yöntemdir ve findViewById kullanımından çok daha kullanışlıdır.

Bu yöntemi kullanabilmek için şu adımları izlemeliyiz:
1. build.gradle (Module: app) dosyasına aşağıdaki kodu eklemeliyiz:

\`\`\`gradle
   android {
    //burada diğer android kodları var, viewBinding kodunu onların altına yazıyoruz.
    buildFeatures {
        viewBinding = true
    }
}
\`\`\`

bu kodu ekledikten sonra sync now yapıyoruz.

2. MainActivity.kt dosyasına gelip şu değişiklikleri yapıyoruz:

\`\`\`kotlin
   //MainActivity sınıfının içerisinde
  private lateinit var binding: ActivityMainBinding //xml ismi mainbinding diye böyle
  \`\`\`


Ardından OnCreate fonksiyonunda binding'i initialize ediyoruz.

   \`\`\`kotlin
   override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding = ActivityMainBinding.inflate(layoutInflater)
    val view = binding.root
    setContentView(view)
   }
\`\`\`

   Bu kodda binding'i initialize ediyoruz ve view'i set ediyoruz.

   Sonrasında OnCreate fonksiyonundan \`setContentView(R.layout.activity_main)\` kodunu kaldırıyoruz çünkü view artık set edildi.

   Ardından layout dosyasında kullanılan bileşenlerin id'lerini kotlinde değiştirebiliriz.
   
   Örneğin:

   \`\`\`kotlin
   binding.textView.text = "Red Dead Redemption 2" //Önceki sayfadaki RDR 2 yazısı Red Dead Redemption 2 yazısına dönüşür.
   \`\`\`

   <img src="/images/rdr2.png" width="500" height="250" style="object-fit: cover; display: block; margin: 0;" loading="lazy" alt="Blog Resmi" />

   Görüleceği üzere tek satırda iş bitti, diğeri gibi tanımlama falan yapmaya gerek yok. İlk başta gerekli tanımlamaları yapıp sonrasında işi çok daha basite indirgiyoruz.

### viewBinding Kullanımı (Butonlar İle)

Bu kısımda iki farklı yöntemle butonların kodlarını kotlinde düzenlemeyi öğreneceğiz.

- 1. Yöntem setOnClickListener ile düz bir şekilde kod yazmak.

\`\`\`kotlin

binding.button.setOnClickListener {
            binding.textView2.text = "Sonuç: RDR2 iyi bir oyun"
        }
binding.button2.setOnClickListener {
            binding.textView2.text = "Sonuç: RDR2 kötü bir oyun"
        }

\`\`\`

- 2. Yöntem ise butonun onClick fonksiyonunu kotlinde tanımlamak.

Bunun için butonun xml kısmından \`android:onClick="iyiOyun"\` veya \`android:onClick="kotuOyun"\` şeklinde tanımlarız.

Veya butonun üstüne tıklayıp attribute kısmından onClick kısmını bulup \`iyiOyun\` veya \`kotuOyun\` şeklinde tanımlarız.
\`\`\`kotlin
fun iyiOyun (view: View) {
        binding.textView2.text = "Sonuç: RDR2 iyi bir oyun"
    }
fun kotuOyun (view: View) {
        binding.textView2.text = "Sonuç: RDR2 kötü bir oyun"
    }   
\`\`\`

Bu fonksiyonların içine istediğimiz kodları yazabiliriz.

>Not: İlk yöntem daha kullanışlıdır çünkü çok buton varsa her buton için ayrı ayrı fonksiyon tanımlamak zor olur ve aralarında ikinci yöntem için uğraşmaya değecek bir fark göremedim.
## Özet

- findViewById çok çok basit projelerde belki kullanılabilir, projenin verimliliği ve zaman karmaşası açısından kötüdür.

- ViewBinding ise çok daha kullanışlıdır ve projenin verimliliğini arttırır. Kod yazmamızı kolaylaştırır.

- ViewBinding kullanmadan önce kotlinde gerekli tanımlamaları yapmayı unutmamalıyız.
   
   
    `,

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

- Ekleme yapılacak

## Grid Layout

Grid Layout, ızgara görünümü gibi bir görünüm oluşturmak için kullanılır.

- Ekleme yapılacak

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

  Bu blogun pek bir amacı yoktur, kendi keyfi zevklerime göre yazıyorum. Sadece bir şeyler denemek ve unutmamak için bazı şeyleri not almak istedim o kadar :)

  <img src="/images/resim1.png" width="200" height="200" style="object-fit: cover; display: block; margin: 0 auto;" loading="lazy" alt="Blog Resmi" />
  `
};

export const posts: Post[] = [
    createPost({
        id: 25,
        title: "FireBase İşlemleri",
        content: POST_CONTENTS.firebase,
        date: "2025-02-24",
        summary: "Bu kısımda Androidde temel Firebase işlemlerini nasıl yapacağımızı göreceğiz.",
        category: "Veri Tabanı İşlemleri"
      }),
    createPost({
        id: 24,
        title: "Androidde Menü Oluşturma",
        content: POST_CONTENTS.menu,
        date: "2025-02-23",
        summary: "Bu kısımda Androidde menüleri nasıl kullanırız onu göreceğiz.",
        category: "Android"
      }),
    createPost({
        id: 23,
        title: "Şifre Yöneticisi Uygulaması",
        content: POST_CONTENTS.sifre,
        date: "2025-02-21",
        summary: "Bu kısımda yapmış olduğum şifre yöneticisi uygulamasını göstereceğim.",
        category: "Projeler"
      }),
    createPost({
        id: 22,
        title: "Lingo Oyunu Projesi",
        content: POST_CONTENTS.lingo,
        date: "2025-02-12",
        summary: "Bu kısımda basit bir lingo oyunu projesini göstereceğim.",
        category: "Projeler"
      }),
      createPost({
        id: 21,
        title: "Sertifikalar",
        content: POST_CONTENTS.sertifika,
        date: "2025-02-8",
        summary: "Bu kısımda Android ile ilgili sertifikalarımı paylaşacağım.",
        category: "Sertifikalar"
      }),
      createPost({
        id: 20,
        title: "Resimlere Not Ekleme Uygulaması",
        content: POST_CONTENTS.notdefteri,
        date: "2025-02-07",
        summary: "Bu kısımda resimlere not eklemek için yaptığım uygulamayı göstereceğim.",
        category: "Projeler"
      }),
    createPost({
        id: 19,
        title: "Androidde Room ve Dao",
        content: POST_CONTENTS.room,
        date: "2025-02-02",
        summary: "Bu kısımda Andoriide Room ve Dao kavramlarını, diğer veri tabanları ile farklarını ele alacağız.",
        category: "Veri Tabanı İşlemleri"
      }),
    createPost({
        id: 18,
        title: "Androidde Kullanıcı İzinleri",
        content: POST_CONTENTS.izinler,
        date: "2025-02-01",
        summary: "Bu kısımda Andoriide kullanıcı izinlerinin nasıl alındığını göreceğiz.",
        category: "Android"
      }),
    createPost({
        id: 17,
        title: "SQLite Temelleri",
        content: POST_CONTENTS.sqlite,
        date: "2025-01-31",
        summary: "Bu kısımda SQLite temellerini öğreneceğiz.",
        category: "Veri Tabanı İşlemleri"
      }),
    createPost({
        id: 16,
        title: "Andoridde Fragment, Navigation ve Arguments Kullanımı",
        content: POST_CONTENTS.fragment,
        date: "2025-01-31",
        summary: "Bu kısımda Anroidde fragment ve navigation kullanımını öğreneceğiz.",
        category: "Android"
      }),
    createPost({
        id: 15,
        title: "Andoridde RecyclerView Kullanımı",
        content: POST_CONTENTS.recyclerView,
        date: "2025-01-30",
        summary: "Bu kısımda Anroidde çok önemli bir yere sahip olan RecyclerView kullanımını öğreneceğiz.",
        category: "Android"
      }),
    createPost({
        id: 14,
        title: "Hesap Makinesi Projesi",
        content: POST_CONTENTS.hesapMakinesi,
        date: "2025-01-24",
        summary: "Bu kısımda çok basit bir hesap makinesi projesi yapacağız.",
        category: "Android"
      }),
    createPost({
        id: 13,
        title: "Andoridde Bilgi Saklama ve SharedPreferences",
        content: POST_CONTENTS.sharedPreferences,
        date: "2025-01-24",
        summary: "Bu kısımda Andoriddeki bilgi saklama ve sharedPreferences kullanımını öğreneceğiz.",
        category: "Veri Tabanı İşlemleri"
      }),
    createPost({
        id: 12,
        title: "Andoridde Context ve Alert Dialog Kullanımı",
        content: POST_CONTENTS.context,
        date: "2025-01-23",
        summary: "Bu kısımda Andoriddeki App ve Activity Context'leri ve Alert Dialog kullanımını öğreneceğiz.",
        category: "Android"
      }),
    createPost({
        id: 11,
        title: "Andoridde Intent Kullanımı ve Sayfalar Arası Geçiş",
        content: POST_CONTENTS.intent,
        date: "2025-01-22",
        summary: "Bu kısımda Andoriddeki Intent Kullanımı ve Sayfalar Arası Geçiş hakkında detaylı bilgiler verilecektir.",
        category: "Android"
      }),
    createPost({
        id: 10,
        title: "Projede Yaşam Döngüsü",
        content: POST_CONTENTS.yasamDongusu,
        date: "2025-01-21",
        summary: "Bu kısımda Andoriddeki Yaşam Döngüsü hakkında detaylı bilgiler verilecektir.",
        category: "Android"
      }),
    createPost({
        id: 9,
        title: "Projede XML ile Kotlin Kodlarını Birleştirme - ViewBinding",
        content: POST_CONTENTS.xmlkotlin,
        date: "2025-01-21",
        summary: "Bu kısımda layouttaki bileşenlerimizin kodlarını kotlinde düzenlemeyi öğreneceğiz.",
        category: "Android"
      }),
  createPost({
    id: 8,
    title: "Layoutlar ve Çeşitleri - XML",
    content: POST_CONTENTS.android,
    date: "2025-01-20",
    summary: "Bu kısımda Andorid kategorisine Layoutlar ve XML ile giriş yapılacaktır.",
    category: "Android"
  }),
  createPost({
    id: 7,
    title: "Kotlinde Hata Yakalama",
    content: POST_CONTENTS.hata,
    date: "2025-01-13",
    summary: "Bu kısımda Kotlinde hata yakalama hakkında detaylı bilgiler verilecektir.",
    category: "Kotlin"
  }),
  createPost({
    id: 6,
    title: "Kotlinde Fonksiyonel Programlama",
    content: POST_CONTENTS.fonksiyonelProgramlama,
    date: "2025-01-12",
    summary: "Bu kısımda Kotlinde Lambda, Map ve Filter, Scope Fonksiyonları gibi fonksiyonel programlama kavramları hakkında detaylı bilgiler verilecektir.",
    category: "Kotlin"
  }),
  createPost({
    id: 5,
    title: "Kotlin'de Sınıflara ve OOP",
    content: POST_CONTENTS.oop,
    date: "2025-01-10",
    summary: "Kotlin'de nesne yönelimli programlama kavramlarını ve sınıfların nasıl kullanıldığını öğrenelim.",
    category: "Kotlin"
  }),
  createPost({
    id: 4,
    title: 'Kotlinde Dönüştürme(Conversion) ve Nullability',
    category: 'Kotlin',
    date: '2025.01.09',
    summary: 'Bu kısımda Kotlinde değişken türlerini değiştirmek için kullanılan conversion ve nullability hakkında detaylı bilgiler verilecektir',
    content: POST_CONTENTS.conversion
  }),
  createPost({
    id: 3,
    title: 'Kotlinde Karar Yapıları ve Döngüler',
    category: 'Kotlin',
    date: '2025.01.09',
    summary: 'Bu kısımda Kotlinde karar yapıları (if-else, when) ve döngüler (for, while, do-while, foreach) hakkında detaylı bilgiler verilecektir.',
    content: POST_CONTENTS.donguler
  }),
  createPost({
    id: 2,
    title: 'Kotlinde Diziler, Listeler, Mapler ve Setler',
    category: 'Kotlin',
    date: '2025.01.08',
    summary: 'Bu kısımda Kotlinde Diziler, Listeler, Mapler ve Setler hakkında detaylı bilgiler verilecektir.',
    content: POST_CONTENTS.veriYapilari
  }),
  createPost({
    id: 1,
    title: 'Kotlinde Değişken Tanımlama ve Değişken Tipleri',
    category: 'Kotlin',
    date: '2025.01.08',
    summary: 'Bu kısımda Kotlinde bulunan çeşitli değişken tanımlama yöntemleri ve değişken tipleri hakkında detaylı bilgiler verilecektir.',
    content: POST_CONTENTS.degiskenler
  }),
  createPost({
    id: 0,
    title: 'Blogun Amacı',
    category: 'Blogun Amacı',
    date: '2025.01.05',
    summary: 'Blogu neden açtım? Böyle bir blog neden var :D',
    content: POST_CONTENTS.blogunAmaci
  })
]; 