import { Router } from "express"
import { MessageModel } from "../../modules/message"

const router = Router()

// 🗓️ Weekly Report Route (Filtered by isRasoi or isPavti)
router.get("/report/weekly", async (req, res) => {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 6) // last 7 days

    // 📥 Fetch filtered messages within date range
    const messages = await MessageModel.find({
      sendedAt: {
        $gte: startDate,
        $lte: endDate,
      },
      $or: [
        { isRasoi: true },
        { isPavti: true },
        { isError: true } 
      ]
    }).sort({ sendedAt: -1 }).lean()

    // 📅 Group messages by date
    const grouped: Record<string, any[]> = {}
    for (const msg of messages) {
      if (!msg.sendedAt) continue

      const dateKey = new Date(msg.sendedAt).toISOString().split("T")[0]
      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(msg)
    }

    res.status(200).json({
      success: true,
      message: "Weekly report (Rasoi & Pavti) generated",
      data: grouped,
    })
  } catch (err) {
    console.error("Weekly report error:", err)
    res.status(500).json({ success: false, message: "Server Error" })
  }
})

router.get("/report/weekly/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const messages = await MessageModel.find({
      sendedAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ sendedAt: -1 }).lean();

    res.status(200).json({
      success: true,
      message: "Daily report fetched",
      data: messages,
    });
  } catch (err) {
    console.error("Daily report error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router
