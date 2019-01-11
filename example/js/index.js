/*
 * @author: heyingye(https://github.com/HeyingYe/dealImage)
 * @Date:   2019-01-11 19:30:38
 */

/*
 * @param  target      Object        canvas目标元素
 * @param  image       String        图片url
 * @param  mosaicSize  Number        马赛克大小
 * return  dealImage实例对象
 */
function DealImage({target, image, mosaicSize=20}) {

    this.canvas = document.querySelector(target);

    this._canvas = document.createElement("canvas");

    if(!this.canvas && this.canvas.getContext) return false

    if(!image) throw new Error("缺少图片url")

    this.opt = {
        image: image,
        mosaicSize: mosaicSize,
        ctx: this.canvas.getContext('2d'),
        _ctx: this._canvas.getContext('2d'),
        fileName: this.getFileName(image)
    }
}

DealImage.prototype = {
    constructor: DealImage,

    draw: function(_opt) {

        var img  = new Image(),
            self = this;

        img.onload = function() {
            /*
            获取图片上的所有像素点
             */
            self.getImageData(img);

            /*
            处理打码
             */
            if(_opt.mosaic) self.drawMosaic(_opt.mosaic)

            /*
            处理线框
             */
             if(_opt.frame) self.drawFrame(_opt.frame)

            /*
            处理成功后，直接覆盖至页面上的目标canvas
             */
            self.opt.ctx.drawImage(self._canvas, 0, 0)

            /*
            处理成功后，若传进的是file对象则主动释放内存
            */
            if(self.opt.image === "object") {
              URL.revokeObjectURL(self.url);
            }

            /*
            处理成功后的回调函数
             */
            if(typeof _opt.callback == "function") {
                let imgBase64 = self.canvas.toDataURL(_opt.type)
                _opt.callback(imgBase64, self.opt.fileName)
            }
        }

        /*
        设置crossOrigin属性解决资源跨域问题，
        不然无法调用getImageData和toDataURL方法
        https://www.zhangxinxu.com/wordpress/2018/02/crossorigin-canvas-getimagedata-cors/
         */
        img.crossOrigin = '';
        /*
        判断image类型，file对象则使用URL.createObjectURL转换成blob对象
        */
        if(typeof this.opt.image === "string"){
          img.src = this.opt.image;
        } else {
          this.url = URL.createObjectURL(this.opt.image)
          img.src = this.url;
        }
    },
    drawMosaic(_opt) {

        if(!this.isJson(_opt.position)) throw new TypeError("参数必须是json数组对象")

        var r, g, b, color, self = this;

        _opt.position.forEach(function(item, index) {

            if(!self.isObject(item)) return false

                for(let y = item.start[1]; y <= item.end[1]; y += self.opt.mosaicSize) {

                    for(let x = item.start[0]; x <= item.end[0]; x += self.opt.mosaicSize) {

                        /*
                        获取具体位置上像素点的RGB值，然后在canvas上重新绘制图片
                         */
                        r = self.imageData[(y * self._canvas.width + x) * 4];
                        g = self.imageData[(y * self._canvas.width + x) * 4 + 1];
                        b = self.imageData[(y * self._canvas.width + x) * 4 + 2];

                        color = `rgb(${r}, ${g}, ${b})`;

                        /*
                        在图像具体位置生成马赛克
                         */
                        self.opt._ctx.fillStyle = color
                        self.opt._ctx.fillRect(x, y, self.opt.mosaicSize, self.opt.mosaicSize)
                    }
                }
        })
    },
    drawFrame: function(_opt) {

        if(!this.isJson(_opt.position)) throw new TypeError("参数必须是json数组对象")

        var self = this;

        _opt.position.forEach(function(item, index) {

            if(!self.isObject(item)) return false

            /*
            起始一条路径，或重置当前路径
             */
            self.opt._ctx.beginPath();

            /*
            把路径移动到画布中的指定点，不创建线条
             */
            self.opt._ctx.moveTo(item.start[0], item.start[1])

            /*
            添加一个新点，然后在画布中创建从该点到最后指定点的线条
             */
            self.opt._ctx.lineTo(item.start[0], item.end[1])
            self.opt._ctx.lineTo(item.end[1], item.end[1])
            self.opt._ctx.lineTo(item.end[0], item.start[1])
            self.opt._ctx.lineTo(item.start[0], item.start[1])

            /*
            绘制已定义的路径
             */
            self.opt._ctx.strokeStyle = _opt.color;
            self.opt._ctx.stroke();
        })
    },
    isObject: function(obj) {

        return Object.prototype.toString.call(obj) === "[object Object]";
    },
    isJson: function(option) {

        if(!(option instanceof Array)) return false

        var self = this, temp = [];

        option.forEach((item, index) => {
            temp.push(self.isObject(item))
        })

        return temp.length > 0 && !temp.includes(false)
    },
    getFileName: function(image) {

        let filename;
        if(typeof image == "string") {

          let tempArr = image.split("/");

          filename = tempArr[tempArr.length - 1].split(".")[0];

        } else {

          filename = image.name.split(".")[0]

        }
        return filename;
    },
    getImageData: function(img) {

        this.canvas.width = img.width;
        this.canvas.height = img.height;

        this._canvas.width = img.width;
        this._canvas.height = img.height;

        this.opt._ctx.drawImage(img, 0, 0)

        /*
        获取图像像素点
         */
        this.imageData = this.opt._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height).data

    }
}
