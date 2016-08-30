define(function () {
    var Viewport = function (canvasId, width, height) {
        var _originalCanvas = document.getElementById(canvasId);
        var _originalCtx = _originalCanvas.getContext("2d");
        var _ratio = this.getPixelRatio(_originalCtx);

        this.canvasId = canvasId;
        this.width = width;
        this.height = height;
        this.canvas = this.createHiDPICanvas(_originalCanvas, _ratio);
        this.ctx = this.canvas.getContext("2d");

        this.active = false;
        this.offset = {
            x: 0,
            y: 0
        };
    };

    Viewport.prototype.getPixelRatio = function (ctx) {
        var dpr = window.devicePixelRatio || 1;
        var bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

        return dpr / bsr;
    };

    Viewport.prototype.createHiDPICanvas = function (canvas, ratio) {
        canvas.width = this.width * ratio;
        canvas.height = this.height * ratio;
        canvas.style.width = this.width + "px";
        canvas.style.height = this.height + "px";
        canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);

        return canvas;
    };

    return Viewport;
});
