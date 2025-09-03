const sharp = require('sharp');

const sizes = [512, 192, 48];
const input = 'mobileOffline.png';

sizes.forEach(size => {
  sharp(input)
    .resize(size, size)
    .toFile(`packages/frontend/public/icons/icon-${size}x${size}.png`)
    .then(() => console.log(`Created icon-${size}x${size}.png`))
    .catch(err => console.error(err));
});
