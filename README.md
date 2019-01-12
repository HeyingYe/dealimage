# dealimage
Using canvas to process pictures
详情请看文章
[何如使用canvas做图片处理
](https://heyingye.github.io/2019/01/12/%E4%BD%95%E5%A6%82%E4%BD%BF%E7%94%A8canvas%E5%81%9A%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86/)
```
npm i dealimage --save
```
# html
``` 
 <canvas id="canvas"></canvas>
 <p><img src="" alt=""></p>
 <input type="file" name="" value="">
 ```
# js
 ```
 var inputEle = document.querySelector("input");
 inputEle.addEventListener("change", function() {

   var img = new DealImage({
       target: "#canvas",
       mosaicSize: 10,
       image: "https://avatars1.githubusercontent.com/u/25859283?v=4"
   })

   img.draw({
       type: "image/png",
       mosaic: {
           position: [
               {start: [50, 50], end: [150, 150]},
               {start: [200, 200], end: [300, 300]},
           ],
       },
       frame: {
           position: [
               {start: [50, 50], end: [150, 150]},
               {start: [200, 200], end: [300, 300]},
           ],
           color: "red"
       },
       callback: function(imgBase64, filename) {

           let imgEle = document.querySelector("img"),
               linkEle = document.createElement("a");

           imgEle.src = imgBase64;

           /*
           下载图片
            */
           // linkEle.style.display = "none";
           // linkEle.download = filename;
           // linkEle.href = imgBase64;

           // document.body.appendChild(linkEle);
           // linkEle.click();
           // // 然后移除
           // document.body.removeChild(linkEle);
       }
   })
 })
 ```
