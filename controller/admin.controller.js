import akunAdminModel from "../model/akun_admin.model.js";
import akunSiswaModel from "../model/akun_siswa.model.js";
import informasiModel from "../model/informasi.model.js";
import galeriModel from "../model/galeri.model.js";
import dataSiswa from "../model/data_siswa.model.js";
import dataOrangTua from "../model/data_orang_tua.model.js";
import dataAlamat from "../model/data_alamat.model.js";
import prestasiSiswa from "../model/prestasi_siswa.model.js";
import brosurModel from "../model/brosur.model.js";

import response from "../response/index.js";
import fs from "fs";
import crypto from "crypto-js";

const { setContent, getContent } = response;

const getAdmin = async (req, res) => {
  try {
    const getAdmin = await akunAdminModel.findByPk(
      req.sessionData.id_akun_admin,
      {
        attributes: {
          exclude: ["password"],
        },
      }
    );
    if (!getAdmin) {
      setContent(404, "Admin Tidak Ditemukan!");
      return res.status(404).json(getContent());
    } else {
      setContent(200, getAdmin);
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const postAdmin = async (req, res) => {
  // if (req.file == undefined) {
  //   setContent(201, "image upload failed.");
  //   return res.status(201).json(getContent());
  // } else {
  try {
    const getDataAkun = await akunAdminModel.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!getDataAkun) {
      const newAdmin = new akunAdminModel(req.body);
      newAdmin.password = crypto.MD5(req.body.password).toString();

      await newAdmin.save();
      setContent(200, "Admin Berhasil Ditambahkan");
      return res.status(200).json(getContent());
    } else {
      setContent(500, "Username Telah Tersedia");
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
  // }
};

const ubahAdmin = async (req, res) => {
  // if (req.file == undefined) {
  //   setContent(201, "image upload failed.");
  //   return res.status(201).json(getContent());
  // } else {
  try {
    const getDataAkun = await akunAdminModel.findByPk(
      req.sessionData.id_akun_admin
    );

    if (getDataAkun) {
      req.body.password === ""
        ? (req.body.password = getDataAkun.password)
        : (req.body.password = crypto.MD5(req.body.password).toString());

      try {
        await akunAdminModel.update(req.body, {
          where: {
            id_akun_admin: req.sessionData.id_akun_admin,
          },
        });
        setContent(200, "Admin Berhasil Diubah");
        return res.status(200).json(getContent());
      } catch (error) {
        setContent(200, "Admin Gagal Diubah");
        return res.status(200).json(getContent());
      }
    } else {
      setContent(200, "Admin Tidak Ditemukan");
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
  // }
};

const getInformasi = async (req, res) => {
  try {
    const informasi = await informasiModel.findByPk(req.body.id_informasi);
    if (!informasi) {
      setContent(404, "Informasi Tidak Ditemukan!");
      return res.status(404).json(getContent());
    } else {
      setContent(200, informasi);
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const postInformasi = async (req, res) => {
  if (req.file == undefined) {
    setContent(201, "image upload failed.");
    return res.status(201).json(getContent());
  } else {
    try {
      const newInformasi = new informasiModel(req.body);
      newInformasi.id_akun_admin = req.sessionData.id_akun_admin;
      newInformasi.banner = req.file.filename;

      await newInformasi.save();
      setContent(200, "Informasi Berhasil Ditambahkan");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  }
};

const putContentInformasi = async (req, res) => {
  req.body.id_akun_admin = req.sessionData.id_akun_admin;

  const findInformasi = await informasiModel.findOne({
    where: {
      id_informasi: req.body.id_informasi,
    },
  });

  if (!findInformasi) {
    setContent(200, "Konten Tidak Ditemukan!");
    return res.status(200).json(getContent());
  } else {
    try {
      await informasiModel.update(req.body, {
        where: {
          id_informasi: req.body.id_informasi,
        },
      });
      setContent(200, "Konten Informasi Berhasil Diubah!");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  }
};

const delInformasi = async (req, res) => {
  try {
    const getInformasi = await informasiModel.findByPk(req.body.id_informasi);
    if (!getInformasi) {
      setContent(500, "Informasi tidak ditemukan!");
      return res.status(500).json(getContent());
    }
    const getGaleri = await galeriModel.findAll({
      where: {
        id_informasi: req.body.id_informasi,
      },
    });

    try {
      getGaleri.map(async (item) => {
        fs.unlink("./image/banner/" + item.foto, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
      await galeriModel.destroy({
        where: {
          id_informasi: req.body.id_informasi,
        },
      });
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }

    try {
      fs.unlink("./image/banner/" + getInformasi.banner, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      await informasiModel.destroy({
        where: {
          id_informasi: req.body.id_informasi,
        },
      });
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }

    setContent(200, "Konten Informasi Berhasil Dihapus!");
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const postGaleri = async (req, res) => {
  if (req.files == undefined) {
    setContent(201, "image upload failed.");
    return res.status(201).json(getContent());
  } else {
    try {
      req.files.map(async (item) => {
        const newGaleri = new galeriModel(req.body);
        newGaleri.id_informasi = req.body.id_informasi;
        newGaleri.foto = item.filename;

        await newGaleri.save();
      });
      setContent(200, "Semua Gambar Berhasil Ditambahkan");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  }
};

const isiNilai = async (req, res) => {
  const findSiswa = await akunSiswaModel.findOne({
    where: {
      id_akun_siswa: req.body.id_akun_siswa,
    },
  });

  if (!findSiswa) {
    setContent(200, "Siswa Tidak Ditemukan!");
    return res.status(200).json(getContent());
  } else {
    try {
      await akunSiswaModel.update(
        {
          nilai: req.body.nilai,
          keterangan: req.body.keterangan,
        },
        {
          where: {
            id_akun_siswa: req.body.id_akun_siswa,
          },
        }
      );
      setContent(200, "Nilai dan Keterangan Berhasil Disimpan!");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  }
};

const dashboardAdmin = async (req, res) => {
  try {
    const getAllSiswa = await akunSiswaModel.findAll();
    const getAllMTS = await akunSiswaModel.findAll({
      where: {
        keterangan: 1,
      },
    });
    const getAllMPTS = await akunSiswaModel.findAll({
      where: {
        keterangan: 0,
      },
    });

    const result = {
      allSiswa: getAllSiswa.length,
      allMTSSiswa: getAllMTS.length,
      allMPTSSiswa: getAllMPTS.length,
    };
    setContent(200, result);
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const dataSiswaAdmin = async (req, res) => {
  try {
    const [getAllSiswa, metadata] = await akunSiswaModel.sequelize.query(
      "SELECT * from datasiswaadmin"
    );

    setContent(200, getAllSiswa);
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const searchSiswaAdmin = async (req, res) => {
  try {
    const [getAllSiswa, metadata] = await akunSiswaModel.sequelize.query(
      `SELECT * FROM datasiswaadmin WHERE nama_lengkap LIKE '%` +
        req.body.nama +
        `%'`
    );

    setContent(200, getAllSiswa);
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const detailSiswaAdmin = async (req, res) => {
  try {
    const getDataAkun = await akunSiswaModel.findOne({
      attributes: {
        exclude: ["password"],
      },
      where: {
        id_akun_siswa: req.body.id_akun_siswa,
      },
    });
    const getDataSiswa = await dataSiswa.findOne({
      where: {
        id_akun_siswa: req.body.id_akun_siswa,
      },
    });
    const getDataOrangtua = await dataOrangTua.findOne({
      where: {
        id_akun_siswa: req.body.id_akun_siswa,
      },
    });
    const getDataAlamat = await dataAlamat.findOne({
      where: {
        id_akun_siswa: req.body.id_akun_siswa,
      },
    });
    const getDataPrestasi = await prestasiSiswa.findOne({
      where: {
        id_akun_siswa: req.body.id_akun_siswa,
      },
    });

    const result = {
      data_akun_siswa: getDataAkun,
      data_siswa: getDataSiswa,
      data_orangtua: getDataOrangtua,
      data_alamat: getDataAlamat,
      data_prestasi: getDataPrestasi,
    };
    setContent(200, result);
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const cetakDataAdmin = async (req, res) => {
  try {
    const [getCetakData, metadata] = await akunSiswaModel.sequelize.query(
      "SELECT * from cetakdata"
    );

    setContent(200, getCetakData);
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const searchCetakDataAdmin = async (req, res) => {
  try {
    const [getCetakData, metadata] = await akunSiswaModel.sequelize.query(
      "SELECT * from cetakdata where tahun_masuk = '" +
        req.body.tahun_masuk +
        "'"
    );

    setContent(200, getCetakData);
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const postBrosur = async (req, res) => {
  if (req.file == undefined) {
    setContent(201, "image upload failed.");
    return res.status(201).json(getContent());
  } else {
    try {
      let brosur = await brosurModel.findOrCreate({
        where: {
          id_brosur: 1,
        },
        defaults: {
          link: req.file.filename,
        },
      });

      if (brosur[1] === false) {
        try {
          const oldBrosur = await brosurModel.findByPk(1);

          fs.unlink("./image/brosur/" + oldBrosur.link, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });

          await brosurModel.update(
            {
              link: req.file.filename,
            },
            {
              where: {
                id_brosur: 1,
              },
            }
          );
        } catch (error) {
          setContent(500, error);
          return res.status(500).json(getContent());
        }
      }

      setContent(200, "Brosur Berhasil Ditambahkan!");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  }
};

const getDataBrosur = async (req, res) => {
  try {
    const getLinkBrosur = await brosurModel.findByPk(1);
    if (!getLinkBrosur) {
      setContent(404, "Link Tidak Ditemukan!");
      return res.status(404).json(getContent());
    } else {
      setContent(200, getLinkBrosur);
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

export default {
  getAdmin,
  postAdmin,
  ubahAdmin,
  getInformasi,
  postInformasi,
  putContentInformasi,
  delInformasi,
  postGaleri,
  isiNilai,
  dashboardAdmin,
  dataSiswaAdmin,
  searchSiswaAdmin,
  detailSiswaAdmin,
  cetakDataAdmin,
  searchCetakDataAdmin,
  postBrosur,
  getDataBrosur,
};
