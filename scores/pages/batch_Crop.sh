lilypond -fpng ../bwv-1004_5_for_PNGs.ly && sips -r 90 *.png && mkdir -p cropped
for f in *.png; do ffmpeg -y -i "${f}" -vf  "crop=1095:96:85:12" "cropped/${f%%.*}.jpg"; done
ffmpeg -y -i "bwv-1004_5_for_PNGs-page1.png"    -vf  "crop=1142:96:38:12" "cropped/bwv-1004_5_for_PNGs-page1.jpg"
ffmpeg -y -i "bwv-1004_5_for_PNGs-page34.png"   -vf  "crop=1142:96:38:12" "cropped/bwv-1004_5_for_PNGs-page34.jpg"
ffmpeg -y -i "bwv-1004_5_for_PNGs-page53.png"   -vf  "crop=1142:96:38:12" "cropped/bwv-1004_5_for_PNGs-page53.jpg"
