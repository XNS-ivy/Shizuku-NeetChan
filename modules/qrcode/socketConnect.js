import QRCode from 'qrcode'

export async function renderCompactQR(data) {
    const qr = QRCode.create(data, {
        errorCorrectionLevel: 'L',
    })

    const modules = qr.modules
    const size = modules.size
    const matrix = modules.data

    for (let y = 0; y < size; y += 2) {
        let row = ''
        for (let x = 0; x < size; x++) {
            const top = matrix[y * size + x]
            const bottom = (y + 1 < size) ? matrix[(y + 1) * size + x] : 0

            if (top && bottom) row += '█'
            else if (top && !bottom) row += '▀'
            else if (!top && bottom) row += '▄'
            else row += ' '
        }
        console.log(row)
    }
}