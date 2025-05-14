#!/bin/bash

# Repo yapısını oluştur
mkdir -p python-app nextjs-app

# Mevcut Python uygulamasını taşı
mv app.py requirements.txt templates python-app/
cp Dockerfile python-app/

# Next.js uygulamasını hazırla
# Bu kısmı manuel olarak yapmanız gerekecek - Next.js dosyalarını nextjs-app klasörüne kopyalayın

echo "Repo yapısı hazırlandı!"
echo "Şimdi Next.js uygulamanızı 'nextjs-app' klasörüne kopyalayabilirsiniz."
