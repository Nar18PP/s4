import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Middleware เพื่อให้ Express รู้จัก JSONd
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // อนุญาตเฉพาะต้นทางนี้
    methods: ["GET", "POST"],
    credentials: true,
  },
});

dotenv.config();

// ฟังก์ชันส่งอีเมล
const sendEmail = async (email, otp) => {
  const mailOptions = {
    from: "Foraling <foraling37@gmail.com>",
    to: email,
    subject: "ยืนยัน OTP ของคุณ",
    text: `รหัส OTP ของคุณคือ: ${otp}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`อีเมลถูกส่งไปที่ ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

// Send OTP
app.post("/api/send-email", async (req, res) => {
  const { inputEmail } = req.body;
  const randomOtp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(
      "SELECT * FROM user WHERE user_emailtest = ? AND user_email = ?",
      [inputEmail, inputEmail]
    );

    if (result.length > 0) {
      return res.status(400).send("ມີຜູ້ໃຊ້ອີເມວນີ້ແລ້ວ");
    }
    if (!validateEmail(inputEmail)) {
      return res.status(400).send("ອີເມວບໍ່ຖືກຕ້ອງ");
    }
    await connection.execute(
      "INSERT INTO user (user_emailtest, user_otp) VALUES (?, ?)",
      [inputEmail, randomOtp]
    );
    await sendEmail(inputEmail, randomOtp);

    res.status(200).send("OTP ถูกส่งแล้ว");
  } catch (error) {
    console.error("Error sending email or saving to database:", error);
    res.status(500).send("Error sending email or saving to database");
  } finally {
    if (connection) connection.release();
  }
});

// สร้าง API Route
app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});

app.get("/api/products", (req, res) => {
  const products = [
    {
      id: 1,
      name: "ຜັດໄກ່23",
      heart: 957,
      price: 67,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzb0IFD9i42VcxKBRLdtzQsQHEKrXWJuqBEw&s",
    },
    {
      id: 2,
      name: "ເບີເກີ່",
      heart: 1520,
      price: 38,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBZL-_s71i1m6RLSIIfxfg0D9rR91Z8MLLbQ&s",
    },
    {
      id: 3,
      name: "ຍຳທະເລ",
      heart: 541,
      price: 163,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUPZ8Hv38DtbZs2gqhTLkKT-MgbmHTHpdHVw&s",
    },
    {
      id: 4,
      name: "ຍຳສະລັດ",
      heart: 5971,
      price: 29,
      img: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 5,
      name: "ສະມູດຕີ່",
      heart: 1672,
      price: 54,
      img: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 6,
      name: "ເຄັກຊອກໂກແລັດ",
      heart: 541,
      price: 210,
      img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 7,
      name: "ຊີ້ນໝາ",
      heart: 662,
      price: 56,
      img: "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 8,
      name: "ຊູຊິ",
      heart: 25563,
      price: 156,
      img: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 9,
      name: "ຊີ້ນງົວ",
      heart: 954,
      price: 84,
      img: "https://images.pexels.com/photos/793785/pexels-photo-793785.jpeg?auto=compress&cs=tinysrgb&w=600https://images.pexels.com/photos/769290/pexels-photo-769290.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 10,
      name: "ໄຂ່ຕົ້ມ",
      heart: 2359,
      price: 59,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUPZ8Hv38DtbZs2gqhTLkKT-MgbmHTHpdHVw&s",
    },
    {
      id: 11,
      name: "ພິດຊ່າ",
      heart: 587,
      price: 85,
      img: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?cs=srgb&dl=pexels-vince-2147491.jpg&fm=jpg",
    },
  ];
  for (let i = 12; i <= 50; i++) {
    products.push({
      id: i,
      name: `Product555 ${i}`,
      heart: Math.floor(Math.random() * 1000),
      price: Math.floor(Math.random() * 100) + 1,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUPZ8Hv38DtbZs2gqhTLkKT-MgbmHTHpdHVw&s",
    });
  }
  res.json(products);
});


let intervel1 = {};
let countuser = {};
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("test1", () => {

    if (intervel1[socket.id]) {
      return;
    }
    if(!countuser[socket.id]){
      countuser[socket.id] = 10;
    }


    intervel1[socket.id] = setInterval(() => {
      countuser[socket.id] -= 1;

      socket.emit('countdown', countuser[socket.id])
      
      if (countuser[socket.id] <= 0) {
        socket.emit('countdown', 'Send')
        clearInterval(intervel1[socket.id]);
        intervel1[socket.id] = null;

      }
    }, 1000);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
