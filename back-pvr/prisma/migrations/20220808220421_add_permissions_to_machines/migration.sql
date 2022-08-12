-- CreateTable
CREATE TABLE "_MachineToMachineToPermission" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MachineToMachineToPermission_AB_unique" ON "_MachineToMachineToPermission"("A", "B");

-- CreateIndex
CREATE INDEX "_MachineToMachineToPermission_B_index" ON "_MachineToMachineToPermission"("B");

-- AddForeignKey
ALTER TABLE "_MachineToMachineToPermission" ADD CONSTRAINT "_MachineToMachineToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "MachineToMachine"("clientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MachineToMachineToPermission" ADD CONSTRAINT "_MachineToMachineToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
