@REM faker gen types

git cl git@github.com:faker-js/faker.git
cd faker
call bun install
call dts-bundle-generator -o faker.d.ts src/index.ts
FOR /F "tokens=*" %%g IN ('npm pkg get version') do (SET VAR=%%g)
echo // %VAR% >> faker.d.ts