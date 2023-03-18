lilypond -fpng ../bwv-1004_5_for_PNGs.ly && sips -r 90 *.png && mkdir -p cropped && mkdir -p cropped_transparent
for f in *.png; do ffmpeg -y -i "${f}" -vf  "crop=1095:96:85:12,colorkey=white:0.3:0.5" "cropped_transparent/${f%%.*}.png"; done
ffmpeg -y -i "bwv-1004_5_for_PNGs-page1.png"    -vf  "crop=1142:96:38:12,colorkey=white:0.3:0.5" "cropped_transparent/bwv-1004_5_for_PNGs-page1.png"
ffmpeg -y -i "bwv-1004_5_for_PNGs-page34.png"   -vf  "crop=1142:96:38:12,colorkey=white:0.3:0.5" "cropped_transparent/bwv-1004_5_for_PNGs-page34.png"
ffmpeg -y -i "bwv-1004_5_for_PNGs-page53.png"   -vf  "crop=1142:96:38:12,colorkey=white:0.3:0.5" "cropped_transparent/bwv-1004_5_for_PNGs-page53.png"


# 
ffmpeg -f lavfi -i color=c=white@0.5:s=1920x1080,format=rgba -i "bwv-1004_5_for_PNGs-page1.png" -shortest -filter_complex "[1:v]colorkey=white[ckout];[0:v][ckout]overlay[out]" -map "[out]" out.png

for f in *.png; do ffmpeg -y -i "${f}" -vf  "crop=1095:96:85:12" "cropped/${f%%.*}.jpg"; done

ffmpeg -i "bwv-1004_5_for_PNGs-page1.png" -vf colorkey=white:0.3:0.5 out.png

# for f in *.jpg; do magick "${f}" -fill "rgba(255,255,255,0.5)" -opaque #ffffff "${f%%.*}.png"; done

# for f in *.jpg; do echo "${f%%.*}.png"; done
