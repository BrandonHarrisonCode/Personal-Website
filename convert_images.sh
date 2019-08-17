# Delete old photos, if any
rm --force public_html/resources/headshot.jpg public_html/resources/smallheadshot.jpg

# Convert to size, requires imagemagick
convert -resize 2399x1649 $1 public_html/resources/headshot.jpg
convert -resize 1200x792 $1 public_html/resources/smallheadshot.jpg

# Strip metadata for privacy, requires perl-image-exiftool
exiftool -quiet -overwrite_original -all= public_html/resources/headshot.jpg
exiftool -quiet -overwrite_original -all= public_html/resources/smallheadshot.jpg
