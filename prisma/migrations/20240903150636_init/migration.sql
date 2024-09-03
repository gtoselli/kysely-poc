-- CreateTable
CREATE TABLE "reservation__concerts" (
    "id" TEXT NOT NULL,
    "seats" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "reservation__concerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation__available_seats" (
    "id" TEXT NOT NULL,
    "concertId" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,

    CONSTRAINT "reservation__available_seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management__concerts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "seatingCapacity" INTEGER NOT NULL,

    CONSTRAINT "management__concerts_pkey" PRIMARY KEY ("id")
);
