lilypond -fpng ../bwv-1004_5.ly && sips -r 90 *.png && mkdir -p cropped
for f in *.png; do ffmpeg -y -i "${f}" -vf  "crop=1100:96:80:12" "cropped/${f%%.*}.png"; done
ffmpeg -y -i "bwv-1004_5-page1.png"    -vf  "crop=1150:96:30:12" "cropped/bwv-1004_5-page1.png"
