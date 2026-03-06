-- CreateTable
CREATE TABLE "pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carro" (
    "id" SERIAL NOT NULL,
    "modelo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,

    CONSTRAINT "carro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoa_por_carro" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "carroId" INTEGER NOT NULL,

    CONSTRAINT "pessoa_por_carro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_email_key" ON "pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_por_carro_pessoaId_carroId_key" ON "pessoa_por_carro"("pessoaId", "carroId");

-- AddForeignKey
ALTER TABLE "pessoa_por_carro" ADD CONSTRAINT "pessoa_por_carro_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_por_carro" ADD CONSTRAINT "pessoa_por_carro_carroId_fkey" FOREIGN KEY ("carroId") REFERENCES "carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
