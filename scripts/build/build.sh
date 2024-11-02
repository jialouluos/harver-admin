npm run build # 主应用build
cd ./packages/blog_admin
npm run build
cp -r dist ../../mainAppDist/blog_admin/
cd ../demo
npm run build
cp -r dist ../../mainAppDist/demo/