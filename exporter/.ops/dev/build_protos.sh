

echo "BUILDING PROTO FILES"

find -name '*.proto' -exec echo {} \;

find -name '*.proto' \
  -exec protoc {} \
    -I./ \
    -I/usr/include/ \
    --go_out=plugins=grpc:/pb/go \
    --js_out=import_style=commonjs,binary:/pb/js \;

tree /pb/go/pb

tree /pb/js