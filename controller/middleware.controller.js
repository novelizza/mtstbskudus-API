import sessionSiswaModel from "../model/sessionSiswa.model.js";
import sessionAdminModel from "../model/sessionAdmin.model.js";
import response from "../response/index.js";
import moment from "moment";

const { setContent, getContent } = response;

const checkSessionSiswa = async (req, res, next) => {
  const now = moment(Date.now()).tz("Asia/Jakarta").format();
  try {
    const findSession = await sessionSiswaModel.findOne({
      where: {
        session: req.headers.session,
      },
    });
    if (!findSession) {
      setContent(401, "Sesi Tidak Ditemukan!");
      return res.status(401).json(getContent());
    } else {
      if (findSession.expired_at < moment(now)) {
        setContent(401, "Sesi Telah Habis!");
        return res.status(401).json(getContent());
      } else {
        req.sessionData = findSession;
        return next();
      }
    }
  } catch (error) {
    setContent(400, "Bad Request");
    return res.status(400).json(getContent());
  }
};

const checkSessionAdmin = async (req, res, next) => {
  const now = moment(Date.now()).tz("Asia/Jakarta").format();
  try {
    const findSession = await sessionAdminModel.findOne({
      where: {
        session: req.headers.session,
      },
    });
    if (!findSession) {
      setContent(401, "Sesi Tidak Ditemukan!");
      return res.status(401).json(getContent());
    } else {
      if (findSession.expired_at < moment(now)) {
        setContent(401, "Sesi Telah Habis!");
        return res.status(401).json(getContent());
      } else {
        req.sessionData = findSession;
        return next();
      }
    }
  } catch (error) {
    setContent(400, "Bad Request");
    return res.status(400).json(getContent());
  }
};

export default {
  checkSessionSiswa,
  checkSessionAdmin,
};
