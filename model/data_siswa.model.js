import Sequelize from "sequelize";
import db from "../config/database.js";

const Akun = db.define(
  "data_siswa",
  {
    id_data_siswa: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_akun_siswa: { type: Sequelize.INTEGER },

    nik: { type: Sequelize.STRING },
    kewarganegaraan: { type: Sequelize.BOOLEAN },
    jenis_kelamin: { type: Sequelize.BOOLEAN },
    jumlah_saudara: { type: Sequelize.INTEGER },
    anak_ke: { type: Sequelize.INTEGER },
    agama: {
      type: Sequelize.ENUM(
        "Islam",
        "Kristen",
        "Katholik",
        "Hindu",
        "Konghucu",
        "Lainnya"
      ),
    },
    cita_cita: { type: Sequelize.STRING },
    no_hp: { type: Sequelize.STRING },
    yang_membiayai: {
      type: Sequelize.ENUM("Orang Tua", "Wali"),
    },
    kebutuhan_khusus: { type: Sequelize.BOOLEAN },
    prasekolah: { type: Sequelize.STRING },
    asal_sekolah: { type: Sequelize.STRING },
    kip: { type: Sequelize.STRING },
    kk: { type: Sequelize.STRING },
    kepala_keluarga: { type: Sequelize.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default Akun;
