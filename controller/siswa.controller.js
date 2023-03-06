import akunSiswaModel from "../model/akun_siswa.model.js";
import dataAlamatModel from "../model/data_alamat.model.js";
import dataOrangTuaModel from "../model/data_orang_tua.model.js";
import dataSiswaModel from "../model/data_siswa.model.js";
import prestasiSiswaModel from "../model/prestasi_siswa.model.js";
// import BniEnc from "./BniEncryption";
import response from "../response/index.js";
import crypto from "crypto-js";
import moment from "moment";
import fs from "fs";
import axios from "axios";

// import { createRequire } from "module";
import BniEnc from "./BniEncryption.cjs";
// const require = createRequire(import.meta.url);
// let BniEnc = require("./BniEncryption.cjs");

const { setContent, getContent } = response;

const getSiswa = async (req, res) => {
  // const cid = process.env.CID;
  // const sck = process.env.SCK;
  // const two_hours = new Date(+new Date() + 2 * 3600 * 1000);

  // const test_data = {
  //   type: "createbilling",
  //   trx_amount: 100000,
  //   customer_name: "David",
  //   customer_email: "david@example.com",
  //   customer_phone: "08123456781011",
  //   description: "Test Create Billing",
  //   trx_id: "invoice-0001", // this should be unique
  //   virtual_account: null,
  //   billing_type: "c",
  //   client_id: cid,
  //   datetime_expired: two_hours.toISOString(),
  // };

  // const ecrypt_string = BniEnc.encrypt(test_data, cid, sck);
  // const parsed_string = BniEnc.decrypt(ecrypt_string, cid, sck);

  // console.log("hasil encrypt : " + ecrypt_string);
  // console.log("hasil decrypt : ");
  // console.log(parsed_string);

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
  try {
    const dataReqVA = {
      type: "createbilling",
      client_id: process.env.CID,
      trx_id: "invoice-" + req.data.nama_lengkap + req.data.nisn, // this should be unique
      trx_amount: 200000,
      billing_type: "c",
      customer_name: req.body.nama_lengkap,
    };

    const ecrypt_string = BniEnc.encrypt(
      dataReqVA,
      process.env.CID,
      process.env.SCK
    );

    await axios
      .post(
        process.env.BASEURL_BNI,
        {
          clien_id: process.env.CID,
          prefix: process.env.PRX,
          data: ecrypt_string,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (res) => {
        console.log("ini res dari BNI");
        console.log(res.data);
        const parsed_string = BniEnc.decrypt(res.data, cid, sck);

        const akunSiswa = await akunSiswaModel.findOne({
          where: {
            username: req.body.username,
          },
        });

        if (!akunSiswa) {
          if (req.file == undefined) {
            setContent(201, "image upload failed.");
            return res.status(201).json(getContent());
          } else {
            try {
              const newSiswa = new akunSiswaModel(req.body);
              newSiswa.password = crypto.MD5(req.body.password).toString();
              newSiswa.avatar = req.file.filename;
              newSiswa.tahun_masuk =
                moment().year() + "/" + (Number(moment().year()) + 1);
              newSiswa.bayar = 0;
              newSiswa.va = parsed_string.virtual_account;
              newSiswa.trx_id = parsed_string.trx_id;

              await newSiswa.save();
              setContent(200, "Siswa Berhasil Ditambahkan");
              return res.status(200).json(getContent());
            } catch (error) {
              setContent(500, error);
              return res.status(500).json(getContent());
            }
          }
        } else {
          setContent(500, "Username Telah Terdaftar");
          return res.status(500).json(getContent());
        }
      })
      .catch((er) => {
        console.log(er.response);
      });
  } catch (error) {
    setContent(500, "Gagal membuat VA");
    return res.status(500).json(getContent());
  }
};

const ubahSiswa = async (req, res) => {
  const akunSiswa = await akunSiswaModel.findOne({
    where: {
      id_akun_siswa: req.sessionData.id_akun_siswa,
    },
  });

  if (akunSiswa) {
    try {
      req.body.password === ""
        ? (req.body.password = akunSiswa.password)
        : (req.body.password = crypto.MD5(req.body.password).toString());

      console.log(req.body);

      await akunSiswaModel.update(req.body, {
        where: {
          id_akun_siswa: req.sessionData.id_akun_siswa,
        },
      });

      setContent(200, "Siswa Berhasil Diubah");
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, "Siswa Gagal Diubah");
      return res.status(500).json(getContent());
    }
  } else {
    setContent(500, "Username Telah Terdaftar");
    return res.status(500).json(getContent());
  }
};

const ubahAvaSiswa = async (req, res) => {
  const akunSiswa = await akunSiswaModel.findOne({
    where: {
      id_akun_siswa: req.sessionData.id_akun_siswa,
    },
  });

  if (akunSiswa) {
    if (req.file == undefined) {
      setContent(201, "image upload failed.");
      return res.status(201).json(getContent());
    } else {
      try {
        fs.unlink("./image/siswa" + akunSiswa.avatar, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });

        await akunSiswaModel.update(
          {
            avatar: req.file.filename,
          },
          {
            where: {
              id_akun_siswa: req.sessionData.id_akun_siswa,
            },
          }
        );

        setContent(200, "Siswa Berhasil Diubah");
        return res.status(200).json(getContent());
      } catch (error) {
        setContent(500, "Siswa Gagal Diubah");
        return res.status(500).json(getContent());
      }
    }
  } else {
    setContent(500, "Username Telah Terdaftar");
    return res.status(500).json(getContent());
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
  ubahSiswa,
  ubahAvaSiswa,
  data_siswa,
  getDataSiswa,
  data_orang_tua,
  getDataOrangTua,
  data_alamat,
  getDataAlamat,
  prestasi_siswa,
  getDataPrestasi,
};
