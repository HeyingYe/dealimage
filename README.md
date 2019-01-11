# dealimage
Using canvas to process pictures
npm i dealimage

##html
<canvas id="canvas"></canvas>
<p><img src="" alt=""></p>
<input type="file" name="" value="">

##js
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
