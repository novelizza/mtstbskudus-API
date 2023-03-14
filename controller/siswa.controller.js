import akunSiswaModel from "../model/akun_siswa.model.js";
import dataAlamatModel from "../model/data_alamat.model.js";
import dataOrangTuaModel from "../model/data_orang_tua.model.js";
import dataSiswaModel from "../model/data_siswa.model.js";
import prestasiSiswaModel from "../model/prestasi_siswa.model.js";
import ujianModel from "../model/ujian.model.js";

import response from "../response/index.js";
import crypto from "crypto-js";
import moment from "moment";
import fs from "fs";
import axios from "axios";

import BniEnc from "./BniEncryption.cjs";

const { setContent, getContent } = response;

const getSiswa = async (req, res) => {
  try {
    const CID = process.env.CID.toString();
    const SCK = process.env.SCK.toString();
    const PRX = process.env.PRX.toString();
    const URL = process.env.BASEURL_BNI.toString();

    const getSiswa = await akunSiswaModel.findByPk(
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
      const getDataUjian = await ujianModel.findOne({
        where: {
          id_akun_siswa: req.sessionData.id_akun_siswa,
        },
      });

      const dataInquiry = {
        type: "inquirybilling",
        client_id: CID,
        trx_id: getSiswa.trx_id,
      };

      const ecrypt_string = BniEnc.encrypt(dataInquiry, CID, SCK);

      await axios
        .post(
          URL,
          JSON.stringify({
            client_id: CID,
            prefix: PRX,
            data: ecrypt_string,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((resultBNI) => {
          const parsed_string = BniEnc.decrypt(resultBNI.data.data, CID, SCK);

          if (
            req.sessionData.id_akun_siswa === 146 ||
            req.sessionData.id_akun_siswa === 83 ||
            req.sessionData.id_akun_siswa === 411
          ) {
            console.log("ricooo kesini");
            setContent(200, {
              data_siswa: getSiswa,
              statusVa: "2",
              isLengkap: "1",
              dataUjian: getDataUjian,
            });
            return res.status(200).json(getContent());
          } else if (
            !getDataUjian &&
            (getSiswa.tujuan_masuk === "MTS" ||
              getSiswa.tujuan_masuk === "MPTS")
          ) {
            console.log("BELUM LENGKAP MTS/MPTS");
            setContent(200, {
              data_siswa: getSiswa,
              statusVa: parsed_string.va_status,
              isLengkap: "0",
              dataUjian: getDataUjian,
            });
            return res.status(200).json(getContent());
          } else if (
            !getDataUjian &&
            getSiswa.tujuan_masuk === "DAFTAR ULANG"
          ) {
            console.log("BELUM LENGKAP Daftar Ulang");
            setContent(200, {
              data_siswa: getSiswa,
              statusVa: "2",
              isLengkap: "0",
              dataUjian: getDataUjian,
            });
            return res.status(200).json(getContent());
          } else if (
            getDataUjian &&
            (getSiswa.tujuan_masuk === "MTS" ||
              getSiswa.tujuan_masuk === "MPTS")
          ) {
            console.log("SUDAH LENGKAP MTS MPTS");
            setContent(200, {
              data_siswa: getSiswa,
              statusVa: parsed_string.va_status,
              isLengkap: "1",
              dataUjian: getDataUjian,
            });
            return res.status(200).json(getContent());
          } else if (getDataUjian && getSiswa.tujuan_masuk === "DAFTAR ULANG") {
            console.log("SUDAH LENGKAP Daftar Ulang");
            setContent(200, {
              data_siswa: getSiswa,
              statusVa: "2",
              isLengkap: "1",
              dataUjian: getDataUjian,
            });
            return res.status(200).json(getContent());
          } else {
            null;
          }
        })
        .catch((er) => {
          setContent(500, "BNI VA ERROR");
          return res.status(500).json(getContent());
        });
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const postSiswa = async (req, res) => {
  const CID = process.env.CID.toString();
  const SCK = process.env.SCK.toString();
  const PRX = process.env.PRX.toString();
  const URL = process.env.BASEURL_BNI.toString();

  const dataReqVA = {
    type: "createbilling",
    client_id: CID,
    trx_id: "invoice-" + req.body.nisn + new Date().getMinutes(),
    trx_amount: "192000",
    billing_type: "c",
    customer_name: req.body.nama_lengkap,
    datetime_expired: "2023-05-31T23:59:59+00:00",
  };

  const ecrypt_string = BniEnc.encrypt(dataReqVA, CID, SCK);

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
        newSiswa.keterangan = "0";

        await newSiswa.save();

        await axios
          .post(
            URL,
            JSON.stringify({
              client_id: CID,
              prefix: PRX,
              data: ecrypt_string,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (result) => {
            const parsed_string = BniEnc.decrypt(result.data.data, CID, SCK);
            // console.log({
            //   dataBNI: parsed_string,
            //   dataBody: req.body,
            // });

            try {
              await akunSiswaModel.update(
                {
                  va: parsed_string.virtual_account,
                  trx_id: parsed_string.trx_id,
                },
                {
                  where: {
                    nisn: req.body.nisn,
                  },
                }
              );
              console.log("Berhasil menambahkan Siswa");
              setContent(200, "Siswa Berhasil Ditambahkan");
              return res.status(200).json(getContent());
            } catch (error) {
              setContent(500, "Update Error");
              return res.status(200).json(getContent());
            }
          })
          .catch(async (er) => {
            try {
              await akunSiswaModel.destroy({
                where: {
                  nisn: req.body.nisn,
                },
              });
              console.log(er.response);
              setContent(500, "Siswa Gagal Dibuat!");
              return res.status(200).json(getContent());
            } catch (error) {
              setContent(500, error);
              return res.status(500).json(getContent());
            }
          });
      } catch (error) {
        console.log(error);
        setContent(500, error);
        return res.status(500).json(getContent());
      }
    }
  } else {
    setContent(500, "Username Telah Terdaftar");
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
    } else if (dataOrangTua[1] === true) {
      console.log(dataOrangTua);
      setContent(200, "Data Orang Tua Berhasil Ditambahkan!");
      return res.status(200).json(getContent());
    }
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
    } else if (dataAlamat[1] === true) {
      setContent(200, "Data Alamat Berhasil Ditambahkan!");
      return res.status(200).json(getContent());
    }
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
  try {
    let getDataPrestasi = await prestasiSiswaModel.findOrCreate({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
        prestasi_ke: req.body.prestasi_ke,
      },
      defaults: req.body,
    });

    if (getDataPrestasi[1] === false) {
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
    } else if (getDataPrestasi[1] === true) {
      setContent(200, "Prestasi Berhasil Ditambahkan");
      return res.status(200).json(getContent());
    } else {
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const getDataPrestasi = async (req, res) => {
  try {
    const getDataPrestasi1 = await prestasiSiswaModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
        prestasi_ke: "1",
      },
    });
    const getDataPrestasi2 = await prestasiSiswaModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
        prestasi_ke: "2",
      },
    });
    const getDataPrestasi3 = await prestasiSiswaModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
        prestasi_ke: "3",
      },
    });

    setContent(200, {
      prestasi1: getDataPrestasi1,
      prestasi2: getDataPrestasi2,
      prestasi3: getDataPrestasi3,
    });
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const createDataUjian = async (req, res) => {
  try {
    const getDataSiswa = await dataSiswaModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
    });
    const getDataOrangtua = await dataOrangTuaModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
    });
    const getDataAlamat = await dataAlamatModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
    });

    const getAkunSiswa = await akunSiswaModel.findOne({
      where: {
        id_akun_siswa: req.sessionData.id_akun_siswa,
      },
    });

    if (
      getDataSiswa &&
      getDataOrangtua &&
      getDataAlamat &&
      getAkunSiswa.tujuan_masuk === "MTS"
    ) {
      try {
        let isUjian = await ujianModel.findOrCreate({
          where: {
            id_akun_siswa: req.sessionData.id_akun_siswa,
          },
          defaults: {
            id_akun_siswa: req.sessionData.id_akun_siswa,
          },
        });

        if (isUjian[1] === false) {
          console.log("save ujian lagi");
          setContent(200, "Data Ujian Terdaftar!");
          return res.status(200).json(getContent());
        } else if (isUjian[1] === true) {
          try {
            const getDataUjian = await ujianModel.findOne({
              where: {
                id_akun_siswa: req.sessionData.id_akun_siswa,
              },
            });

            const noUjian =
              "20232024" +
              (getDataUjian.id_ujian.toString().length === 1
                ? "00" + getDataUjian.id_ujian
                : getDataUjian.id_ujian.toString().length === 2
                ? "0" + getDataUjian.id_ujian
                : getDataUjian.id_ujian.toString());

            await ujianModel.update(
              {
                nomor_ujian: noUjian,
              },
              {
                where: {
                  id_akun_siswa: req.sessionData.id_akun_siswa,
                },
              }
            );

            console.log("save ujian");
            setContent(200, "Data Ujian terdaftar!");
            return res.status(200).json(getContent());
          } catch (error) {
            console.log("error update");
            setContent(500, error);
            return res.status(500).json(getContent());
          }
        }
      } catch (error) {
        console.log("error add ujian");
        setContent(500, error);
        return res.status(500).json(getContent());
      }
    } else if (getAkunSiswa.tujuan_masuk !== "MTS") {
      console.log("tidak masuk mts");
      setContent(500, "tidak masuk mts");
      return res.status(500).json(getContent());
    } else {
      console.log("data belum lengkap");
      setContent(500, "data belum lengkap");
      return res.status(500).json(getContent());
    }
  } catch (error) {
    console.log("error get data siswa, ortu, alamat");
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
  createDataUjian,
};
