import Sequelize from "sequelize";
import db from "../config/database.js";

const Akun = db.define(
  "data_orang_tua",
  {
    id_data_orang_tua: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_akun_siswa: { type: Sequelize.INTEGER },

    nama_lengkap_ayah: { type: Sequelize.STRING },
    status_ayah: {
      type: Sequelize.ENUM("Hidup", "Meninggal", "Tidak Tahu"),
    },
    kewarganegaraan_ayah: { type: Sequelize.BOOLEAN },
    nik_ayah: { type: Sequelize.STRING },
    tempat_lahir_ayah: { type: Sequelize.STRING },
    tanggal_lahir_ayah: { type: Sequelize.DATEONLY },
    pendidikan_terakhir_ayah: {
      type: Sequelize.ENUM("SD", "SLTP", "SLTA", "D3", "S1/D4", "S2", "S3"),
    },
    pekerjaan_utama_ayah: {
      type: Sequelize.ENUM(
        "TIDAK BEKERJA",
        "PENSIUNAN",
        "PNS",
        "TNI/POLRI",
        "DOSEN/GURU",
        "PEGAWAI SWASTA",
        "WIRASWASTA",
        "BURUH (TANI/PABRIK/BANGUNAN)"
      ),
    },
    penghasilan_rata_rata_ayah: {
      type: Sequelize.ENUM(
        "KURANG DARI 500000",
        "500000-1000000",
        "1000000-2000000",
        "2000000-3000000",
        "3000000-5000000",
        "DIATAS 5000000"
      ),
    },
    nomor_hp_ayah: { type: Sequelize.STRING },

    nama_lengkap_ibu: { type: Sequelize.STRING },
    status_ibu: {
      type: Sequelize.ENUM("Hidup", "Meninggal", "Tidak Tahu"),
    },
    kewarganegaraan_ibu: { type: Sequelize.BOOLEAN },
    nik_ibu: { type: Sequelize.STRING },
    tempat_lahir_ibu: { type: Sequelize.STRING },
    tanggal_lahir_ibu: { type: Sequelize.DATEONLY },
    pendidikan_terakhir_ibu: {
      type: Sequelize.ENUM("SD", "SLTP", "SLTA", "D3", "S1/D4", "S2", "S3"),
    },
    pekerjaan_utama_ibu: {
      type: Sequelize.ENUM(
        "TIDAK BEKERJA",
        "PENSIUNAN",
        "PNS",
        "TNI/POLRI",
        "DOSEN/GURU",
        "PEGAWAI SWASTA",
        "WIRASWASTA",
        "BURUH (TANI/PABRIK/BANGUNAN)"
      ),
    },
    penghasilan_rata_rata_ibu: {
      type: Sequelize.ENUM(
        "KURANG DARI 500000",
        "500000-1000000",
        "1000000-2000000",
        "2000000-3000000",
        "3000000-5000000",
        "DIATAS 5000000"
      ),
    },
    nomor_hp_ibu: { type: Sequelize.STRING },

    nama_lengkap_wali: { type: Sequelize.STRING },
    kewarganegaraan_wali: { type: Sequelize.BOOLEAN },
    nik_wali: { type: Sequelize.STRING },
    tempat_lahir_wali: { type: Sequelize.STRING },
    tanggal_lahir_wali: { type: Sequelize.DATEONLY },
    pendidikan_terakhir_wali: {
      type: Sequelize.ENUM("SD", "SLTP", "SLTA", "D3", "S1/D4", "S2", "S3"),
    },
    pekerjaan_utama_wali: {
      type: Sequelize.ENUM(
        "TIDAK BEKERJA",
        "PENSIUNAN",
        "PNS",
        "TNI/POLRI",
        "DOSEN/GURU",
        "PEGAWAI SWASTA",
        "WIRASWASTA",
        "BURUH (TANI/PABRIK/BANGUNAN)"
      ),
    },
    penghasilan_rata_rata_wali: {
      type: Sequelize.ENUM(
        "KURANG DARI 500000",
        "500000-1000000",
        "1000000-2000000",
        "2000000-3000000",
        "3000000-5000000",
        "DIATAS 5000000"
      ),
    },
    nomor_hp_wali: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Akun;
