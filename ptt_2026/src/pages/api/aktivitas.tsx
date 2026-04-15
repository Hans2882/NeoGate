import type { NextApiRequest, NextApiResponse } from 'next'

type Activity = {
	time: string
	name: string
	status: string
	direction: string
}

type Data = {
	status: boolean
	status_code: number
	data: Activity[]
}

const aktivitas: Activity[] = [
	{ time: '14:12:45', name: 'DHOHO', status: 'PASSED', direction: 'Malang' },
	{ time: '13:58:22', name: 'PENATARAN', status: 'PASSED', direction: 'Surabaya' },
	{ time: '13:45:10', name: 'MALABAR', status: 'UNPASSED', direction: 'Bandung' },
	{ time: '13:30:55', name: 'ARGO BROMO', status: 'PASSED', direction: 'Malang' },
	{ time: '13:15:00', name: 'KERTANEGARA', status: 'PASSED', direction: 'Bekasi' },
	{ time: '15:02:00', name: 'ARGO DWIPANGGA', status: 'PASSED', direction: 'Jakarta' },
	{ time: '14:48:30', name: 'TURANGGA', status: 'PASSED', direction: 'Bandung' },
	{ time: '14:30:10', name: 'SRI TANJUNG', status: 'UNPASSED', direction: 'Banyuwangi' }
]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	res.status(200).json({
		status: true,
		status_code: 200,
		data: aktivitas
	})
}
