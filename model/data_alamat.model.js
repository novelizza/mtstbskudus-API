import Sequelize from "sequelize";
import db from "../config/database.js";

const Akun = db.define(
  "data_alamat",
  {
    id_data_alamat: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_akun_siswa: { type: Sequelize.INTEGER },
    tinggal_luar_negri_ayah: { type: Sequelize.BOOLEAN },
    kepemilikan_rumah_ayah: {
      type: Sequelize.ENUM(
        "MILIK SENDIRI",
        "MILIK ORANG TUA",
        "RUMAH DINAS",
        "SEWA/KONTRAK",
        "LAINNYA"
      ),
    },

    provinsi_ayah: { type: Sequelize.STRING },
    kabupaten_kota_ayah: { type: Sequelize.STRING },
    kecamatan_ayah: { type: Sequelize.STRING },
    kelurahan_desa_ayah: { type: Sequelize.STRING },
    RT_ayah: { type: Sequelize.INTEGER },
    RW_ayah: { type: Sequelize.INTEGER },
    alamat_ayah: { type: Sequelize.STRING },
    kode_pos_ayah: { type: Sequelize.INTEGER },
    provinsi_ibu: { type: Sequelize.STRING },
    kabupaten_kota_ibu: { type: Sequelize.STRING },
    kecamatan_ibu: { type: Sequelize.STRING },
    kelurahan_desa_ibu: { type: Sequelize.STRING },
    RT_ibu: { type: Sequelize.INTEGER },
    RW_ibu: { type: Sequelize.INTEGER },
    alamat_ibu: { type: Sequelize.STRING },
    kode_pos_ibu: { type: Sequelize.INTEGER },
    provinsi_wali: { type: Sequelize.STRING },
    kabupaten_kota_wali: { type: Sequelize.STRING },
    kecamatan_wali: { type: Sequelize.STRING },
    kelurahan_desa_wali: { type: Sequelize.STRING },
    RT_wali: { type: Sequelize.INTEGER },
    RW_wali: { type: Sequelize.INTEGER },
    alamat_wali: { type: Sequelize.STRING },
    kode_pos_wali: { type: Sequelize.INTEGER },
    provinsi_siswa: { type: Sequelize.STRING },
    kabupaten_kota_siswa: { type: Sequelize.STRING },
    kecamatan_siswa: { type: Sequelize.STRING },
    kelurahan_desa_siswa: { type: Sequelize.STRING },
    RT_siswa: { type: Sequelize.INTEGER },
    RW_siswa: { type: Sequelize.INTEGER },
    alamat_siswa: { type: Sequelize.STRING },
    kode_pos_siswa: { type: Sequelize.INTEGER },
    pondok_pesantren: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Akun;
