OUT_DIR=${1-keys}
mkdir -p $OUT_DIR
openssl genrsa -out $OUT_DIR/private.pem 4096;
openssl rsa -in $OUT_DIR/private.pem -outform PEM -pubout -out $OUT_DIR/public.pem;