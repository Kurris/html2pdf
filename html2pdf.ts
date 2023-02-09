import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export const downloadReport2 = (content: any) => {
  download(content)
}

function download(content: any,fileName:string) {
  html2Canvas(content, {
    allowTaint: true,
    scale: 2, // 提升画面质量，但是会增加文件大小
    height: content?.scrollHeight,
    windowHeight: content?.scrollHeight
  }).then(canvas=> {
    /**jspdf将html转为pdf一页显示不截断，整体思路：
     * 1. 获取DOM
     * 2. 将DOM转换为canvas
     * 3. 获取canvas的宽度、高度（稍微大一点）
     * 4. 将pdf的宽高设置为canvas的宽高
     * 5. 将canvas转为图片
     * 6. 实例化jspdf，将内容图片放在pdf中（因为内容宽高和pdf宽高一样，就只需要一页，也防止内容截断问题）
     */

    // 得到canvas画布的单位是px 像素单位
    var contentWidth = canvas.width
    var contentHeight = canvas.height

    console.log('contentWidth', contentWidth)
    console.log('contentHeight', contentHeight)
    // 将canvas转为base64图片
    var pageData = canvas.toDataURL('image/jpeg', 1.0)

    // 设置pdf的尺寸，pdf要使用pt单位 已知 1pt/1px = 0.75   pt = (px/scale)* 0.75
    // 2为上面的scale 缩放了2倍
    var pdfX = (contentWidth + 10) / 2 * 0.75
    var pdfY = (contentHeight + 500) / 2 * 0.75 // 500为底部留白

    // 设置内容图片的尺寸，img是pt单位
    var imgX = pdfX;
    var imgY = (contentHeight / 2 * 0.75); //内容图片这里不需要留白的距离

    // 初始化jspdf 第一个参数方向：默认''时为纵向，第二个参数设置pdf内容图片使用的长度单位为pt，第三个参数为PDF的大小，单位是pt
    var PDF = new JsPDF('' as any, 'pt', [pdfX, pdfY])

    // 将内容图片添加到pdf中，因为内容宽高和pdf宽高一样，就只需要一页，位置就是 0,0
    PDF.addImage(pageData, 'jpeg', 0, 0, imgX, imgY)
    PDF.save(`${fileName}.pdf`)
  })
}
