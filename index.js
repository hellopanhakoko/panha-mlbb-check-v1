const express = require("express");
const path = require("path");
const validasi = require("./lib/validasi");
const countryList = require("./utils/data.json");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


app.get("/api/check-id", async (req, res) => {
  try {
    const { serverid, zoneid } = req.query;

    if (!serverid || !zoneid) {
      return res.status(400).json({
        status: "failed",
        message: "Missing serverid or zoneid"
      });
    }

    const response = await validasi(serverid, zoneid);

    res.json({
      status: "success",
      result: {
        nickname: response["in-game-nickname"],
        country:
          countryList.find(
            c => c.countryShortCode === response.country
          )?.countryName || "Unknown"
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: err?.message || "Internal Server Error"
    });
  }
});



// Keep your existing API endpoint
app.get("/api/validasi", async (req, res) => {
    try {
        let { id, serverid } = req.query;
        if (id && serverid) {
            let response = await validasi(id, serverid);
            return res.json({
                status: "success",
                result: {
                    nickname: response['in-game-nickname'],
                    country: countryList.find(a => a.countryShortCode == response.country)?.countryName || "Unknown"
                }
            });
        } else {
            return res.sendStatus(400);
        }
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            status: "failed",
            message: e?.message || e || "Unknown Error"
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
});
