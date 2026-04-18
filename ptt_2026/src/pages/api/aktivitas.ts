import type { NextApiRequest, NextApiResponse } from 'next'

type Activity = {
  time: string
  name: string
  status: string
  direction: string
}

type ActivityResponse = {
  status: boolean
  status_code: number
  data: Activity[]
}

export default function handler(_req: NextApiRequest, res: NextApiResponse<ActivityResponse>) {
  res.status(200).json({
    status: true,
    status_code: 200,
    data: [
      { time: '14:12:45', name: 'DHOHO', status: 'PASSED', direction: 'Malang' },
      { time: '13:58:22', name: 'PENATARAN', status: 'PASSED', direction: 'Surabaya' },
      { time: '13:45:10', name: 'MALABAR', status: 'UNPASSED', direction: 'Bandung' },
      { time: '13:30:55', name: 'ARGO BROMO', status: 'PASSED', direction: 'Malang' },
      { time: '13:15:00', name: 'KERTANEGARA', status: 'PASSED', direction: 'Bekasi' },
    ],
  })
}
