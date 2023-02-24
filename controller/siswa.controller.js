import akunSiswaModel from "../model/akun_siswa.model.js";
import dataAlamatModel from "../model/data_alamat.model.js";
import dataOrangTuaModel from "../model/data_orang_tua.model.js";
import dataSiswaModel from "../model/data_siswa.model.js";
import prestasiSiswaModel from "../model/prestasi_siswa.model.js";

import response from "../response/index.js";
import crypto from "crypto-js";
import moment from "moment";

const { setContent, getContent } = response;

const getSiswa = async (req, res) => {
  try {
    let getSiswa = await akunSiswaModel.findByPk(
      req.sessionData.id_akun_siswa,
      {
        attributes: {
          exclude: ["password"],
        },
      }
    );

    if (!getSiswa) {
      setContent(404, "Siswa Tidak Ditemukan!");
      return res.status(404).json(getContent());
    } else {
      setContent(200, getSiswa);
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const postSiswa = async (req, res) => {
  if (req.file == undefined) {
    setContent(201, "image upload failed.");
    return res.status(201).json(getContent());
  } else {
    try {
      const newSiswa = new akunSiswaModel(req.body);
      newSiswa.password = crypto.MD5(req.body.password).toString();
      newSiswa.avatar = req.file.path;
      newSiswa.tahun_masuk =
        moment().year() + "/" + (Number(moment().year()) + 1);
      newSiswa.bayar = 0;

      await newSiswa.save();
      setContent(200, "Siswa Berhasil Ditambahkan");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  }
};

const data_siswa = async (req, res) => {
  req.body.id_akun_siswa = req.sessionData.id_akun_siswa;

  try {
    let dataSiswa = await dataSiswaModel.findOrCreate({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
      defaults: req.body,
    });

    if (dataSiswa[1] === false) {
      try {
        await dataSiswaModel.update(req.body, {
          where: {
            id_akun_siswa: req.sessionData.id_akun_siswa,
          },
        });

        setContent(200, "Data Siswa Berhasil Disimpan!");
        return res.status(200).json(getContent());
      } catch (error) {
        setContent(500, error);
        return res.status(500).json(getContent());
      }
    }

    setContent(200, "Data Siswa Berhasil Ditambahkan!");
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const getDataSiswa = async (req, res) => {
  try {
    const getDataSiswa = await dataSiswaModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
    });
    if (!getDataSiswa) {
      setContent(200, "Data siswa belum diisi!");
      return res.status(200).json(getContent());
    } else {
      setContent(200, getDataSiswa);
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const data_orang_tua = async (req, res) => {
  req.body.id_akun_siswa = req.sessionData.id_akun_siswa;

  try {
    let dataOrangTua = await dataOrangTuaModel.findOrCreate({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
      defaults: req.body,
    });

    if (dataOrangTua[1] === false) {
      try {
        await dataOrangTuaModel.update(req.body, {
          where: {
            id_akun_siswa: req.sessionData.id_akun_siswa,
          },
        });
        setContent(200, "Data Orang Tua Berhasil Disimpan!");
        return res.status(200).json(getContent());
      } catch (error) {
        setContent(500, error);
        return res.status(500).json(getContent());
      }
    }

    setContent(200, "Data Orang Tua Berhasil Ditambahkan!");
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const getDataOrangTua = async (req, res) => {
  try {
    const getDataOrangTua = await dataOrangTuaModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
    });

    if (!getDataOrangTua) {
      setContent(200, "Data Orang Tua Belum Diisi!");
      return res.status(200).json(getContent());
    } else {
      setContent(200, getDataOrangTua);
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const data_alamat = async (req, res) => {
  req.body.id_akun_siswa = req.sessionData.id_akun_siswa;

  try {
    let dataAlamat = await dataAlamatModel.findOrCreate({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
      defaults: req.body,
    });

    if (dataAlamat[1] === false) {
      try {
        await dataAlamatModel.update(req.body, {
          where: {
            id_akun_siswa: req.sessionData.id_akun_siswa,
          },
        });
        setContent(200, "Data Alamat Berhasil Disimpan!");
        return res.status(200).json(getContent());
      } catch (error) {
        setContent(500, error);
        return res.status(500).json(getContent());
      }
    }

    setContent(200, "Data Alamat Berhasil Ditambahkan!");
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const getDataAlamat = async (req, res) => {
  try {
    const getDataAlamat = await dataAlamatModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
    });
    if (!getDataAlamat) {
      setContent(200, "Data Alamat Belum Diisi!");
      return res.status(200).json(getContent());
    } else {
      setContent(200, getDataAlamat);
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const prestasi_siswa = async (req, res) => {
  const getDataPrestasi = await prestasiSiswaModel.findAll({
    where: {
      id_akun_siswa: req.sessionData.id_akun_siswa,
    },
  });
  if (!getDataPrestasi || getDataPrestasi.length < 3) {
    try {
      let newPrestasi = new prestasiSiswaModel(req.body);
      newPrestasi.id_akun_siswa = req.sessionData.id_akun_siswa;

      await newPrestasi.save();
      setContent(200, "Prestasi Berhasil Ditambahkan");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  } else {
    console.log(getDataPrestasi.length);
    try {
      await prestasiSiswaModel.update(req.body, {
        where: {
          id_akun_siswa: req.sessionData.id_akun_siswa,
          prestasi_ke: req.body.prestasi_ke,
        },
      });
      setContent(200, "Prestasi Berhasil Diubah");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  }
};

const getDataPrestasi = async (req, res) => {
  try {
    const getDataPrestasi = await prestasiSiswaModel.findAll({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
    });
    if (!getDataPrestasi) {
      setContent(404, "Tidak Ada Prestasi yang Ditampilkan!");
      return res.status(404).json(getContent());
    } else {
      setContent(200, getDataPrestasi);
      return res.status(200).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

export default {
  getSiswa,
  postSiswa,
  data_siswa,
  getDataSiswa,
  data_orang_tua,
  getDataOrangTua,
  data_alamat,
  getDataAlamat,
  prestasi_siswa,
  getDataPrestasi,
};
