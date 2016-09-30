define(function () {
    var Camera = function (canvasId, width, height) {
        var originalCanvas = document.getElementById(canvasId);
        var originalCtx = originalCanvas.getContext("2d");
        var ratio = this.getPixelRatio(originalCtx);

        this.id = canvasId;
        this.width = width;
        this.height = height;
        this.canvas = this.createHiDPICanvas(originalCanvas, ratio);
        this.ctx = this.canvas.getContext("2d");

        this.isActive = false;
        this.offsetX = 0;
        this.offsetY = 0;
    };

    Camera.prototype.getPixelRatio = function (ctx) {
        var dpr = window.devicePixelRatio || 1;
        var bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    };

    Camera.prototype.createHiDPICanvas = function (canvas, ratio) {
        canvas.width = this.width * ratio;
        canvas.height = this.height * ratio;
        canvas.style.width = this.width + "px";
        canvas.style.height = this.height + "px";
        canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);

        return canvas;
    };

    return Camera;
});
