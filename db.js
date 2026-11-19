
/*
 * HostelCare mock backend:
 * Tables mirror schema.sql and persist in localStorage.
 *
 * Later:
 * Replace each DB.* method body with fetch('/api/...')
 * calls to a Node/Express + MySQL server.
 */

const KEY = 'hostelcare_db_v2';

const day = n =>
    new Date(Date.now() - n * 864e5)
        .toISOString()
        .slice(0, 10);

const now = () =>
    new Date()
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ');


// =====================================================
// 1. SEED DATABASE
// =====================================================

function seed() {

    const t = {
        hostels: [
            {
                id: 1,
                name: 'Gayatri Hostel',
                type: 'Girls',
                floors: 4
            },
            {
                id: 2,
                name: 'Vivekanand Hostel',
                type: 'Boys',
                floors: 3
            }
        ],

        rooms: [],
        users: [],
        complaints: [],
        assignments: [],
        complaint_history: [],
        notices: [],
        outpasses: [],
        tasks: []
    };


    // -------------------------------------------------
    // ROOMS
    // -------------------------------------------------

    let rid = 1;

    [
        [1, ['325', '326', '424', '425', '426', '427']],
        [2, ['112', '113', '214', '215', '318', '319']]
    ].forEach(([h, ns]) => {

        ns.forEach(n => {

            t.rooms.push({
                id: rid++,
                hostel_id: h,
                number: n,
                floor: +n[0],
                capacity: 3
            });

        });

    });


    // -------------------------------------------------
    // DEFAULT STUDENT AND WARDEN
    // -------------------------------------------------

    t.users.push(
        {
            id: 1,
            name: 'Aduita',
            role: 'student',
            email: 'aduita@hostelcare.edu',
            roll: '206',
            room_id: 5,
            phone: '98100 20601',
            dept: 'CSE',
            year: 3
        },

        {
            id: 2,
            name: 'Sukriti Chauhan',
            role: 'warden',
            email: 'sukriti.chauhan@hostelcare.edu',
            phone: '98100 00100',
            hostel_id: 1
        }
    );


    // -------------------------------------------------
    // ADDITIONAL STUDENTS
    // -------------------------------------------------

    [
        ['Ananya Sharma', 5, 'CSE', 3],
        ['Riya Verma', 5, 'ECE', 3],
        ['Kavya Nair', 4, 'CSE', 2],
        ['Pooja Yadav', 4, 'IT', 2],
        ['Isha Gupta', 3, 'ECE', 4],
        ['Meera Iyer', 1, 'CSE', 1],
        ['Rohan Mehta', 7, 'MECH', 3],
        ['Karan Singh', 7, 'CSE', 3],
        ['Aman Tiwari', 9, 'ECE', 2],
        ['Vikram Reddy', 11, 'IT', 4]
    ].forEach((s, i) => {

        t.users.push({
            id: i + 3,
            name: s[0],
            role: 'student',

            email: s[0]
                .toLowerCase()
                .replace(' ', '.') + '@hostelcare.edu',

            roll: String(i < 5 ? 201 + i : 202 + i),
            room_id: s[1],
            phone: '98765 4' + (300 + i),
            dept: s[2],
            year: s[3]
        });

    });


    // -------------------------------------------------
    // MAINTENANCE STAFF
    // -------------------------------------------------

    [
        ['Rajesh Kumar', 'Electrical'],
        ['Suresh Patel', 'Plumbing'],
        ['Mohan Lal', 'Furniture'],
        ['Amit Joshi', 'Internet/Wi-Fi'],
        ['Sunita Devi', 'Cleaning']
    ].forEach((s, i) => {

        t.users.push({
            id: 20 + i,
            name: s[0],
            role: 'staff',
            spec: s[1],

            email: s[0]
                .toLowerCase()
                .replace(' ', '.') + '@hostelcare.edu',

            phone: '98765 0' + i + '100'
        });

    });


    // =================================================
    // 2. SAMPLE COMPLAINTS
    // =================================================

    const C = [
        ['Electrical', 'Ceiling fan not working'],
        ['Plumbing', 'Tap leaking in washroom'],
        ['Furniture', 'Study table drawer broken'],
        ['Internet/Wi-Fi', 'Wi-Fi very slow on floor 2'],
        ['Cleaning', 'Corridor not cleaned for 3 days'],
        ['Mess/Food', 'Hygiene issue in mess'],
        ['Electrical', 'Tube light flickering'],
        ['Security', 'Main gate light off'],
        ['Plumbing', 'No hot water in geyser'],
        ['Furniture', 'Window latch broken'],
        ['Internet/Wi-Fi', 'Router offline in block'],
        ['Cleaning', 'Dustbins overflowing'],
        ['Electrical', 'Socket sparking near bed'],
        ['Other', 'Request for extra mattress']
    ];

    const ST = [
        'Submitted',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed',
        'Resolved',
        'In Progress',
        'Submitted',
        'Assigned',
        'Resolved',
        'Closed',
        'Submitted',
        'In Progress',
        'Rejected'
    ];

    const PR = [
        'Medium',
        'High',
        'Low',
        'High',
        'Medium',
        'Urgent',
        'Low',
        'High',
        'Medium',
        'Low',
        'Medium',
        'Low',
        'Urgent',
        'Low'
    ];


    // -------------------------------------------------
    // CREATE COMPLAINT RECORDS
    // -------------------------------------------------

    C.forEach((c, i) => {

        const id = i + 1;
        const st = ST[i];

        const stu = i % 4 == 0
            ? 1
            : 3 + (i % 9);

        const sp = t.users.find(
            u => u.spec == c[0]
        );

        const done = ['Resolved', 'Closed'].includes(st);


        // COMPLAINT OBJECT

        const cm = {
            id,
            student_id: stu,

            room_id: t.users.find(
                u => u.id == stu
            ).room_id,

            category: c[0],
            title: c[1],

            description:
                'Reported by student. Please look into this at the earliest.',

            priority: PR[i],
            status: st,
            created: day(14 - i),

            resolved_on: done
                ? day(10 - i < 0 ? 0 : 10 - i)
                : null,

            rating: st == 'Closed'
                ? 4 + (i % 2)
                : null,

            feedback: ''
        };

        t.complaints.push(cm);


        // INITIAL COMPLAINT HISTORY

        t.complaint_history.push({
            id: t.complaint_history.length + 1,
            complaint_id: id,
            status: 'Submitted',
            note: 'Complaint raised',
            by: stu,
            at: cm.created + ' 10:00'
        });


        // ASSIGN STAFF

        if (sp && st != 'Submitted' && st != 'Rejected') {

            t.assignments.push({
                id: t.assignments.length + 1,
                complaint_id: id,
                staff_id: sp.id,
                by: 2,
                at: cm.created
            });

            t.complaint_history.push({
                id: t.complaint_history.length + 1,
                complaint_id: id,
                status: 'Assigned',
                note: 'Assigned to ' + sp.name,
                by: 2,
                at: cm.created + ' 14:00'
            });

        }


        // WORK IN PROGRESS HISTORY

        if (
            ['In Progress', 'Resolved', 'Closed'].includes(st)
        ) {

            t.complaint_history.push({
                id: t.complaint_history.length + 1,
                complaint_id: id,
                status: 'In Progress',
                note: 'Work started',
                by: sp ? sp.id : 2,
                at: cm.created + ' 16:00'
            });

        }


        // RESOLVED HISTORY

        if (done) {

            t.complaint_history.push({
                id: t.complaint_history.length + 1,
                complaint_id: id,
                status: 'Resolved',
                note: 'Issue fixed',
                by: sp ? sp.id : 2,
                at: cm.resolved_on + ' 12:00'
            });

        }


        // REJECTED HISTORY

        if (st == 'Rejected') {

            t.complaint_history.push({
                id: t.complaint_history.length + 1,
                complaint_id: id,
                status: 'Rejected',
                note: 'Not a hostel responsibility',
                by: 2,
                at: cm.created + ' 15:00'
            });

        }

    });


    // =================================================
    // 3. NOTICES
    // =================================================

    t.notices.push(

        {
            id: 1,
            title: 'Water supply shutdown',
            body: 'Water supply will be off on Saturday 10 AM - 2 PM for tank cleaning.',
            aud: 'All',
            at: day(1)
        },

        {
            id: 2,
            title: 'Pest control drive',
            body: 'Pest control in all rooms this weekend. Keep food items sealed.',
            aud: 'All',
            at: day(3)
        },

        {
            id: 3,
            title: 'Hostel curfew reminder',
            body: 'Gate closes at 10:00 PM. Late entry needs prior outpass approval.',
            aud: 'All',
            at: day(6)
        },

        {
            id: 4,
            title: 'Mess committee meeting',
            body: 'Student reps to meet the warden on Friday 5 PM.',
            aud: 'Vivekanand Hostel',
            at: day(8)
        }

    );


    // =================================================
    // 4. OUTPASS REQUESTS
    // =================================================

    t.outpasses.push(

        {
            id: 1,
            student_id: 1,
            type: 'Day Out',
            from: day(-2),
            to: day(-2),
            reason: 'Family visit',
            status: 'Pending'
        },

        {
            id: 2,
            student_id: 4,
            type: 'Leave',
            from: day(-5),
            to: day(-9),
            reason: 'Going home for a function',
            status: 'Pending'
        },

        {
            id: 3,
            student_id: 6,
            type: 'Night Out',
            from: day(4),
            to: day(3),
            reason: 'Project work at lab',
            status: 'Approved'
        }

    );


    // =================================================
    // 5. MAINTENANCE TASKS
    // =================================================

    t.tasks.push(

        {
            id: 1,
            title: 'Water tank cleaning',
            staff_id: 24,
            hostel_id: 1,
            due: day(-3),
            freq: 'Monthly',
            status: 'Scheduled'
        },

        {
            id: 2,
            title: 'Fire extinguisher check',
            staff_id: 20,
            hostel_id: 2,
            due: day(-6),
            freq: 'Quarterly',
            status: 'Scheduled'
        },

        {
            id: 3,
            title: 'Generator servicing',
            staff_id: 20,
            hostel_id: 1,
            due: day(-1),
            freq: 'Monthly',
            status: 'In Progress'
        },

        {
            id: 4,
            title: 'Wi-Fi access point audit',
            staff_id: 23,
            hostel_id: 2,
            due: day(2),
            freq: 'Monthly',
            status: 'Done'
        },

        {
            id: 5,
            title: 'Pest control',
            staff_id: 24,
            hostel_id: 1,
            due: day(-2),
            freq: 'Quarterly',
            status: 'Scheduled'
        },

        {
            id: 6,
            title: 'Plumbing inspection',
            staff_id: 21,
            hostel_id: 2,
            due: day(-8),
            freq: 'Monthly',
            status: 'Scheduled'
        }

    );


    return t;

}


// =====================================================
// 6. DATABASE OBJECT
// =====================================================

const DB = {

    t: null,


    // -------------------------------------------------
    // INITIALIZE DATABASE
    // -------------------------------------------------

    init() {

        const r = localStorage.getItem(KEY);

        this.t = r
            ? JSON.parse(r)
            : seed();

        this.save();

    },


    // -------------------------------------------------
    // SAVE DATABASE
    // -------------------------------------------------

    save() {

        localStorage.setItem(
            KEY,
            JSON.stringify(this.t)
        );

    },


    // -------------------------------------------------
    // RESET DATABASE
    // -------------------------------------------------

    reset() {

        localStorage.removeItem(KEY);

        this.init();

    },


    // -------------------------------------------------
    // GENERATE NEW ID
    // -------------------------------------------------

    nid(tb) {

        return Math.max(
            0,
            ...this.t[tb].map(x => x.id)
        ) + 1;

    },


    // -------------------------------------------------
    // ADD COMPLAINT HISTORY
    // -------------------------------------------------

    log(cid, status, note, by) {

        this.t.complaint_history.push({

            id: this.nid('complaint_history'),

            complaint_id: cid,
            status,
            note,
            by,
            at: now()

        });

    },


    // -------------------------------------------------
    // ADD NEW COMPLAINT
    // -------------------------------------------------

    addComplaint(c, by) {

        const id = this.nid('complaints');

        this.t.complaints.push({

            ...c,

            id,
            student_id: by,
            status: 'Submitted',
            created: day(0),
            resolved_on: null,
            rating: null,
            feedback: ''

        });

        this.log(
            id,
            'Submitted',
            'Complaint raised',
            by
        );

        this.save();

        return id;

    },


    // -------------------------------------------------
    // UPDATE COMPLAINT STATUS
    // -------------------------------------------------

    setStatus(id, st, note, by) {

        const c = this.t.complaints.find(
            x => x.id == id
        );

        c.status = st;

        c.resolved_on = ['Resolved', 'Closed'].includes(st)
            ? day(0)
            : null;

        this.log(
            id,
            st,
            note || 'Status updated',
            by
        );

        this.save();

    },


    // -------------------------------------------------
    // ASSIGN STAFF TO COMPLAINT
    // -------------------------------------------------

    assign(id, sid, by) {

        const c = this.t.complaints.find(
            x => x.id == id
        );

        this.t.assignments = this.t.assignments.filter(
            a => a.complaint_id != id
        );

        this.t.assignments.push({

            id: this.nid('assignments'),

            complaint_id: id,
            staff_id: +sid,
            by,
            at: day(0)

        });

        if (
            c.status == 'Submitted' ||
            c.status == 'Reopened'
        ) {
            c.status = 'Assigned';
        }

        this.log(
            id,
            'Assigned',
            'Assigned to ' +
                this.t.users.find(u => u.id == sid).name,
            by
        );

        this.save();

    },


    // -------------------------------------------------
    // RATE COMPLAINT RESOLUTION
    // -------------------------------------------------

    rate(id, r, fb) {

        const c = this.t.complaints.find(
            x => x.id == id
        );

        c.rating = r;
        c.feedback = fb;

        if (c.status == 'Resolved') {
            c.status = 'Closed';
        }

        this.log(
            id,
            c.status,
            `Rated ${r}/5`,
            c.student_id
        );

        this.save();

    },


    // -------------------------------------------------
    // GET ASSIGNED STAFF
    // -------------------------------------------------

    staffOf(cid) {

        const a = this.t.assignments.find(
            x => x.complaint_id == cid
        );

        return a
            ? a.staff_id
            : null;

    }

};


// =====================================================
// 7. INITIALIZE DATABASE
// =====================================================

DB.init();
