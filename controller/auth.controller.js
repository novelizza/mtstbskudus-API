import sessionSiswaModel from "../model/sessionSiswa.model.js";
import sessionAdminModel from "../model/sessionAdmin.model.js";
import akunSiswaModel from "../model/akun_siswa.model.js";
import akunAdminModel from "../model/akun_admin.model.js";
import response from "../response/index.js";
import moment from "moment";
import crypto from "crypto-js";

const { setContent, getContent } = response;

const authSiswa = async (req, res) => {
  try {
    let authUser;

    var ciphertext = crypto.MD5(req.body.password).toString();

    authUser = await akunSiswaModel.findOne({
      where: { username: req.body.username },
    });

    if (!authUser) {
      setContent(404, "User Tidak Ditemukan!");
      return res.status(404).json(getContent());
    } else if (authUser.password !== ciphertext) {
      setContent(401, "Password Anda Salah!");
      return res.status(401).json(getContent());
    }

    const sessionHash = crypto
      .SHA256(
        process.env.SESSION_WORD +
          authUser.nisn +
          authUser.nama_lengkap +
          authUser.username +
          Date.now()
      )
      .toString();
    const sessionEnc = crypto.MD5(sessionHash).toString();
    const now = moment(Date.now()).tz("Asia/Jakarta").format();
    const sessionExpiry = moment(now).add(1, "d").tz("Asia/Jakarta");
    const diff = sessionExpiry.diff(now) / 1000;

    try {
      let resSession = await sessionSiswaModel.findOrCreate({
        where: {
          id_akun_siswa: authUser.id_akun_siswa,
        },
        defaults: {
          id_akun_siswa: authUser.id_akun_siswa,
          session: sessionEnc,
          expire_value: diff,
          expired_at: moment(sessionExpiry).tz("Asia/Jakarta").format(),
        },
      });

      if (resSession[1] === false) {
        try {
          await sessionSiswaModel.update(
            {
              session: sessionEnc,
              expire_value: diff,
              expired_at: moment(sessionExpiry).tz("Asia/Jakarta").format(),
            },
            {
              where: {
                id_akun_siswa: authUser.id_akun_siswa,
              },
            }
          );
        } catch (error) {
          setContent(500, error);
          return res.status(500).json(getContent());
        }
      }

      setContent(200, {
        session: sessionEnc,
        session_expiry: moment(sessionExpiry).tz("Asia/Jakarta").format(),
      });
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const authAdmin = async (req, res) => {
  try {
    let authUser;

    var ciphertext = crypto.MD5(req.body.password).toString();

    authUser = await akunAdminModel.findOne({
      where: { username: req.body.username },
    });

    if (!authUser) {
      setContent(404, "User Tidak Ditemukan!");
      return res.status(404).json(getContent());
    } else if (authUser.password !== ciphertext) {
      setContent(401, "Password Anda Salah!");
      return res.status(401).json(getContent());
    }

    const sessionHash = crypto
      .SHA256(
        process.env.SESSION_WORD +
          authUser.nip +
          authUser.nama_lengkap +
          authUser.username +
          Date.now()
      )
      .toString();
    const sessionEnc = crypto.MD5(sessionHash).toString();

    const now = moment(Date.now()).tz("Asia/Jakarta").format();
    const sessionExpiry = moment(now).add(1, "d").tz("Asia/Jakarta");
    const diff = sessionExpiry.diff(now) / 1000;

    try {
      let resSession = await sessionAdminModel.findOrCreate({
        where: {
          id_akun_admin: authUser.id_akun_admin,
        },
        defaults: {
          id_akun_admin: authUser.id_akun_admin,
          session: sessionEnc,
          expire_value: diff,
          expired_at: moment(sessionExpiry).tz("Asia/Jakarta").format(),
        },
      });

      if (resSession[1] === false) {
        try {
          await sessionAdminModel.update(
            {
              session: sessionEnc,
              expire_value: diff,
              expired_at: moment(sessionExpiry).tz("Asia/Jakarta").format(),
            },
            {
              where: {
                id_akun_admin: authUser.id_akun_admin,
              },
            }
          );
        } catch (error) {
          setContent(500, error);
          return res.status(500).json(getContent());
        }
      }

      setContent(200, {
        session: sessionEnc,
        session_expiry: moment(sessionExpiry).tz("Asia/Jakarta").format(),
      });
      return res.status(200).json(getContent());
    } catch (error) {
      setContent(500, error);
      return res.status(500).json(getContent());
    }
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

// const resetPassword = async (req, res) => {
//   try {
//     const findUser = await pasienModel.findOne({
//       where: {
//         username: req.body.username,
//         nik: req.body.nik,
//         nama: req.body.nama,
//         tgl_lahir: req.body.tgl_lahir,
//         nomor_tlp: req.body.nomor_tlp,
//         ibu_kandung: req.body.ibu_kandung,
//         nama_penanggungjawab: req.body.nama_penanggungjawab,
//         hubungan_penanggungjawab: req.body.hubungan_penanggungjawab,
//       },
//     });
//     if (!findUser) {
//       setContent(404, "Data Pasien Tidak Ditemukan, Silahkan Kontak Admin!");
//       return res.status(404).json(getContent());
//     } else {
//       var newPassword = "";
//       var characters =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//       for (var i = 1; i < 10; i++) {
//         newPassword += characters.charAt(
//           Math.floor(Math.random() * characters.length)
//         );
//       }

//       const cipherText = crypto.AES.encrypt(
//         newPassword,
//         process.env.AES_KEY
//       ).toString();

//       try {
//         const updatePasien = pasienModel.update(
//           { password: cipherText },
//           {
//             where: { id_pasien: findUser.id_pasien },
//           }
//         );
//         await updatePasien;
//         setContent(200, { newPassword: newPassword });
//         return res.status(200).json(getContent());
//       } catch (error) {
//         setContent(500, error);
//         return res.status(500).json(getContent());
//       }
//     }
//   } catch (error) {
//     setContent(500, error);
//     return res.status(500).json(getContent());
//   }
// };

const logoutSiswa = async (req, res) => {
  try {
    await sessionSiswaModel.destroy({
      where: {
        session: req.sessionData.session,
      },
    });
    setContent(200, "Session Berhasil Dihapus!");
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

const logoutAdmin = async (req, res) => {
  try {
    await sessionAdminModel.destroy({
      where: {
        session: req.sessionData.session,
      },
    });
    setContent(200, "Session Berhasil Dihapus!");
    return res.status(200).json(getContent());
  } catch (error) {
    setContent(500, error);
    return res.status(500).json(getContent());
  }
};

export default { authSiswa, logoutSiswa, authAdmin, logoutAdmin };
