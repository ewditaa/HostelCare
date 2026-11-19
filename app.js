
document.documentElement.dataset.theme =
    localStorage.getItem('hc_theme') || 'dark';

function toggleTheme() {
    const d = document.documentElement;

    d.dataset.theme =
        d.dataset.theme == 'dark' ? 'light' : 'dark';

    try {
        localStorage.setItem('hc_theme', d.dataset.theme);
    } catch (e) {}

    render();
}

const TG = () => `
    <button
        class="btn sec sm"
        style="flex:0 0 auto;min-width:0"
        onclick="toggleTheme()"
    >
        ${document.documentElement.dataset.theme == 'dark'
            ? 'Light mode'
            : 'Dark mode'}
    </button>
`;

const $ = s => document.querySelector(s);
const T = () => DB.t;

let S = {
    role: null,
    user: null,
    view: 'dash',
    f: {
        status: '',
        cat: '',
        q: ''
    }
};

const CATS = [
    'Electrical',
    'Plumbing',
    'Furniture',
    'Internet/Wi-Fi',
    'Cleaning',
    'Mess/Food',
    'Security',
    'Other'
];

const NAV = {
    student: [
        ['dash', 'Dashboard'],
        ['new', 'Raise Complaint'],
        ['mine', 'My Complaints'],
        ['room', 'My Room'],
        ['outpass', 'Leave / Outpass'],
        ['mess', 'Mess Menu'],
        ['notices', 'Notices'],
        ['profile', 'Profile']
    ],

    warden: [
        ['dash', 'Dashboard'],
        ['all', 'All Complaints'],
        ['staff', 'Maintenance Staff'],
        ['tasks', 'Maintenance Schedule'],
        ['rooms', 'Rooms & Occupancy'],
        ['students', 'Students'],
        ['outpass', 'Outpass Approvals'],
        ['notices', 'Notices'],
        ['reports', 'Reports'],
        ['log', 'Activity Log']
    ]
};

const U = id => T().users.find(x => x.id == id) || {};
const uname = id => U(id).name || '-';

const R = id => T().rooms.find(x => x.id == id) || {};
const rn = id => R(id).number || '-';

const H = id => T().hostels.find(x => x.id == id)?.name;

const bdg = s =>
    `<span class="b b-${s.replace(/\W/g, '')}">${s}</span>`;

const pri = p =>
    `<span class="p p-${p}">${p}</span>`;

const OPEN = [
    'Submitted',
    'Assigned',
    'In Progress',
    'Reopened'
];

const tbl = (h, r, cl) => `
    <div class="scroll">
        <table>
            <tr>
                ${h.map(x => `<th>${x}</th>`).join('')}
            </tr>

            ${r.length
                ? r.join('')
                : `<tr>
                    <td colspan="${h.length}" class="mut">
                        Nothing here yet.
                    </td>
                   </tr>`
            }
        </table>
    </div>
`;

const stat = (n, l, c) => `
    <div class="card stat">
        <span>${l}</span>
        <b ${c ? `style="color:var(--${c})"` : ''}>
            ${n}
        </b>
    </div>
`;

const bars = o => {
    const m = Math.max(1, ...Object.values(o));

    return Object.entries(o).map(([k, v]) => `
        <div class="bl">
            <span class="small">${k}</span>

            <div class="bar">
                <i style="width:${v / m * 100}%"></i>
            </div>

            <b>${v}</b>
        </div>
    `).join('');
};

const count = (a, f) =>
    a.reduce((o, x) => {
        o[f(x)] = (o[f(x)] || 0) + 1;
        return o;
    }, {});

function toast(m) {
    const t = $('#toast');

    t.textContent = m;
    t.className = 'show';

    setTimeout(() => t.className = '', 2200);
}

function closeM() {
    $('#modal').className = 'modal hidden';
}

function showM(h) {
    $('#modal').innerHTML = `<div class="mbox">${h}</div>`;
    $('#modal').className = 'modal';
}

function go(v) {
    S.view = v;
    render();
}

function logout() {
    S.role = null;
    render();
}

function login(r) {
    S.role = r;
    S.user = T().users.find(u => u.role == r);
    S.view = 'dash';
    render();
}

function render() {
    if (!S.role) {
        $('#app').innerHTML = `
            <div class="login">
                <div class="lbox card">

                    <div class="row" style="flex-wrap:nowrap">
                        <div class="logo" style="padding-bottom:0">
                            <span>Hostel</span>Care
                        </div>

                        ${TG()}
                    </div>

                    <p class="mut" style="margin:6px 0 14px">
                        Hostel Complaint Management System
                    </p>

                    <label>Email</label>
                    <input id="em" value="aduita@hostelcare.edu">

                    <label>Password</label>
                    <input type="password" value="demo1234">

                    <div class="row" style="margin-top:16px">
                        <button class="btn" onclick="login('student')">
                            Login as Student (Aduita)
                        </button>

                        <button class="btn sec" onclick="login('warden')">
                            Login as Warden (Sukriti)
                        </button>
                    </div>

                    <p
                        class="small mut"
                        style="margin-top:14px;cursor:pointer"
                        onclick="
                            if(confirm('Reset all demo data?')) {
                                DB.reset();
                                toast('Demo data reset');
                            }
                        "
                    >
                    </p>

                </div>
            </div>
        `;

        return;
    }

    const n = NAV[S.role];
    const v = VIEWS[S.role + '_' + S.view] || (() => '');

    $('#app').innerHTML = `
        <div class="shell">

            <aside>
                <div class="logo">
                    <span>Hostel</span>Care
                </div>

                ${n.map(x => `
                    <button
                        class="nav ${x[0] == S.view ? 'on' : ''}"
                        onclick="go('${x[0]}')"
                    >
                        ${x[1]}
                    </button>
                `).join('')}

                <button
                    class="nav"
                    onclick="logout()"
                    style="margin-top:14px"
                >
                    Logout
                </button>
            </aside>

            <main>
                <div class="top">

                    <div>
                        <h1>${n.find(x => x[0] == S.view)[1]}</h1>

                        <span class="mut small">
                            ${new Date().toDateString()}
                        </span>
                    </div>

                    <div
                        class="row"
                        style="flex:0 0 auto;flex-wrap:nowrap"
                    >
                        <span class="mut" style="min-width:0">
                            ${S.user.name}
                            (${S.role === 'warden' ? 'Warden' : 'Student'})
                        </span>

                        ${TG()}
                    </div>

                </div>

                ${v()}
            </main>

        </div>
    `;
}

const ct = (c, w) => `
    <tr class="click" onclick="openC(${c.id})">
        <td>#${c.id}</td>

        ${w ? `<td>${uname(c.student_id)}</td>` : ''}

        <td>${c.title}</td>
        <td>${c.category}</td>
        <td>${pri(c.priority)}</td>
        <td>${bdg(c.status)}</td>
        <td>${c.created}</td>
    </tr>
`;

const CH = [
    'ID',
    'Title',
    'Category',
    'Priority',
    'Status',
    'Raised'
];

const CHW = [
    'ID',
    'Student',
    'Title',
    'Category',
    'Priority',
    'Status',
    'Raised'
];

const notices = n =>
    T().notices
        .slice()
        .reverse()
        .slice(0, n || 99)
        .map(x => `
            <div style="margin-bottom:12px">
                <b>${x.title}</b>

                <span class="mut small">
                    ${x.at} | ${x.aud}
                </span>

                <div class="mut">
                    ${x.body}
                </div>
            </div>
        `)
        .join('');

const MESS = {
    Mon: [
        'Poha, Tea',
        'Rice, Dal, Mixed Veg',
        'Samosa, Tea',
        'Chapati, Paneer Curry'
    ],

    Tue: [
        'Idli, Sambar',
        'Rice, Rajma, Salad',
        'Biscuits, Tea',
        'Chapati, Egg Curry / Dal'
    ],

    Wed: [
        'Paratha, Curd',
        'Rice, Sambar, Poriyal',
        'Bhel, Tea',
        'Fried Rice, Manchurian'
    ],

    Thu: [
        'Upma, Tea',
        'Rice, Chole, Raita',
        'Sandwich, Tea',
        'Chapati, Mix Veg'
    ],

    Fri: [
        'Dosa, Chutney',
        'Biryani, Raita',
        'Pakoda, Tea',
        'Chapati, Dal Fry'
    ],

    Sat: [
        'Puri, Bhaji',
        'Rice, Kadhi, Papad',
        'Maggi, Tea',
        'Pulao, Gobi'
    ],

    Sun: [
        'Chole Bhature',
        'Special Thali',
        'Cake, Tea',
        'Chapati, Paneer Butter Masala'
    ]
};

const VIEWS = {

    // STUDENT DASHBOARD

    student_dash() {
        const m = T().complaints.filter(
            c => c.student_id == S.user.id
        );

        const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
            new Date().getDay()
        ];

        return `
            <div class="grid g4">
                ${stat(m.length, 'Total complaints')}
                ${stat(m.filter(c => OPEN.includes(c.status)).length, 'Open', 'warn')}
                ${stat(m.filter(c => c.status == 'Resolved').length, 'Awaiting your feedback', 'pu')}
                ${stat(m.filter(c => c.status == 'Closed').length, 'Closed', 'ok')}
            </div>

            <br>

            <div class="grid g2">

                <div class="card">
                    <h3>Recent complaints</h3>

                    ${tbl(
                        CH,
                        m.slice(-5).reverse().map(c => ct(c))
                    )}

                    <br>

                    <button class="btn" onclick="go('new')">
                        + Raise complaint
                    </button>
                </div>

                <div class="card">
                    <h3>Notices</h3>
                    ${notices(3)}
                </div>

                <div class="card">
                    <h3>Today's mess menu (${d})</h3>

                    ${['Breakfast', 'Lunch', 'Snacks', 'Dinner']
                        .map((x, i) => `
                            <div class="row">
                                <span class="mut">${x}</span>
                                <span>${MESS[d][i]}</span>
                            </div>
                        `).join('')}
                </div>

                <div class="card">
                    <h3>Quick info</h3>

                    <p>
                        Room:
                        <b>${rn(S.user.room_id)}</b>
                        (${H(R(S.user.room_id).hostel_id)})
                    </p>

                    <p>
                        Pending outpass:
                        <b>
                            ${T().outpasses.filter(
                                o => o.student_id == S.user.id &&
                                     o.status == 'Pending'
                            ).length}
                        </b>
                    </p>

                    <p class="mut small">
                        Emergency: Warden 90000 00100 |
                        Security 90000 00200
                    </p>
                </div>

            </div>
        `;
    },

    // STUDENT: NEW COMPLAINT

    student_new() {
        return `
            <div class="card" style="max-width:640px">

                <h3>New complaint</h3>

                <label>Category</label>

                <select id="fc">
                    ${CATS.map(c => `<option>${c}</option>`)}
                </select>

                <label>Title</label>
                <input id="ft" placeholder="Short summary of the issue">

                <label>Priority</label>

                <select id="fp">
                    <option>Low</option>
                    <option selected>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                </select>

                <label>Description</label>

                <textarea
                    id="fd"
                    placeholder="Describe the problem, location and when it started"
                ></textarea>

                <br>

                <button class="btn" onclick="submitC()">
                    Submit complaint
                </button>

            </div>
        `;
    },

    // STUDENT: MY COMPLAINTS

    student_mine() {
        const m = T().complaints
            .filter(c => c.student_id == S.user.id)
            .reverse();

        return `
            <div class="card">
                ${tbl(CH, m.map(c => ct(c)))}
            </div>
        `;
    },

    // STUDENT: ROOM

    student_room() {
        const r = R(S.user.room_id);

        const mates = T().users.filter(
            u => u.room_id == r.id && u.role == 'student'
        );

        return `
            <div class="grid g2">

                <div class="card">
                    <h3>Room ${r.number}</h3>

                    <p>Hostel: ${H(r.hostel_id)}</p>
                    <p>Floor: ${r.floor}</p>

                    <p>
                        Capacity: ${r.capacity}
                        (occupied ${mates.length})
                    </p>
                </div>

                <div class="card">
                    <h3>Roommates</h3>

                    ${tbl(
                        ['Name', 'Roll No', 'Dept'],
                        mates.map(u => `
                            <tr>
                                <td>
                                    ${u.name}
                                    ${u.id == S.user.id ? ' (you)' : ''}
                                </td>
                                <td>${u.roll}</td>
                                <td>${u.dept}</td>
                            </tr>
                        `)
                    )}
                </div>

            </div>
        `;
    },

    // STUDENT: OUTPASS

    student_outpass() {
        const m = T().outpasses.filter(
            o => o.student_id == S.user.id
        );

        return `
            <div class="grid g2">

                <div class="card">
                    <h3>Apply</h3>

                    <label>Type</label>

                    <select id="ot">
                        <option>Day Out</option>
                        <option>Night Out</option>
                        <option>Leave</option>
                    </select>

                    <div class="row">
                        <div>
                            <label>From</label>
                            <input type="date" id="of">
                        </div>

                        <div>
                            <label>To</label>
                            <input type="date" id="oo">
                        </div>
                    </div>

                    <label>Reason</label>
                    <input id="or">

                    <br>

                    <button class="btn" onclick="applyO()">
                        Submit request
                    </button>
                </div>

                <div class="card">
                    <h3>My requests</h3>

                    ${tbl(
                        ['Type', 'From', 'To', 'Status'],
                        m.map(o => `
                            <tr>
                                <td>${o.type}</td>
                                <td>${o.from}</td>
                                <td>${o.to}</td>
                                <td>${bdg(o.status)}</td>
                            </tr>
                        `)
                    )}
                </div>

            </div>
        `;
    },

    // STUDENT: MESS MENU

    student_mess() {
        return `
            <div class="card">
                ${tbl(
                    ['Day', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'],
                    Object.entries(MESS).map(([d, m]) => `
                        <tr>
                            <td><b>${d}</b></td>
                            ${m.map(x => `<td>${x}</td>`).join('')}
                        </tr>
                    `)
                )}
            </div>
        `;
    },

    // STUDENT: NOTICES

    student_notices() {
        return `
            <div class="card">
                ${notices()}
            </div>
        `;
    },

    // STUDENT: PROFILE

    student_profile() {
        const u = S.user;

        return `
            <div class="card" style="max-width:520px">
                <h3>Profile</h3>

                ${[
                    ['Name', u.name],
                    ['Roll No', u.roll],
                    ['Email', u.email],
                    ['Phone', u.phone],
                    ['Department', u.dept],
                    ['Year', u.year],
                    ['Room', rn(u.room_id)],
                    ['Hostel', H(R(u.room_id).hostel_id)]
                ].map(x => `
                    <div class="row">
                        <span class="mut">${x[0]}</span>
                        <b>${x[1]}</b>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // WARDEN DASHBOARD

    warden_dash() {
        const c = T().complaints;

        const op = c.filter(x => OPEN.includes(x.status));
        const rt = c.filter(x => x.rating);

        const av = rt.length
            ? (rt.reduce((a, x) => a + x.rating, 0) / rt.length).toFixed(1)
            : '-';

        return `
            <div class="grid g4">
                ${stat(c.length, 'Total complaints')}
                ${stat(op.length, 'Open', 'warn')}
                ${stat(op.filter(x => x.status == 'Submitted').length, 'Unassigned', 'bad')}
                ${stat(op.filter(x => x.priority == 'Urgent').length, 'Urgent open', 'bad')}
                ${stat(c.filter(x => ['Resolved', 'Closed'].includes(x.status)).length, 'Resolved', 'ok')}
                ${stat(T().outpasses.filter(o => o.status == 'Pending').length, 'Pending outpass', 'pu')}
                ${stat(T().users.filter(u => u.role == 'student').length, 'Students')}
                ${stat(av + ' / 5', 'Avg satisfaction')}
            </div>

            <br>

            <div class="grid g2">

                <div class="card">
                    <h3>By category</h3>
                    ${bars(count(c, x => x.category))}
                </div>

                <div class="card">
                    <h3>By status</h3>
                    ${bars(count(c, x => x.status))}
                </div>

            </div>

            <br>

            <div class="card">
                <h3>Needs attention</h3>

                ${tbl(
                    CHW,
                    op.filter(
                        x => x.status == 'Submitted' ||
                             x.priority == 'Urgent'
                    ).map(x => ct(x, 1))
                )}
            </div>
        `;
    },

    // WARDEN: ALL COMPLAINTS

    warden_all() {
        const f = S.f;

        const c = T().complaints.filter(x =>
            (!f.status || x.status == f.status) &&
            (!f.cat || x.category == f.cat) &&
            (
                !f.q ||
                (x.title + uname(x.student_id))
                    .toLowerCase()
                    .includes(f.q.toLowerCase())
            )
        ).reverse();

        return `
            <div class="card">

                <div class="row">

                    <input
                        placeholder="Search title or student"
                        value="${f.q}"
                        onchange="S.f.q=this.value;render()"
                    >

                    <select onchange="S.f.status=this.value;render()">
                        <option value="">All statuses</option>

                        ${[
                            'Submitted',
                            'Assigned',
                            'In Progress',
                            'Resolved',
                            'Closed',
                            'Rejected',
                            'Reopened'
                        ].map(s => `
                            <option ${f.status == s ? 'selected' : ''}>
                                ${s}
                            </option>
                        `)}
                    </select>

                    <select onchange="S.f.cat=this.value;render()">
                        <option value="">All categories</option>

                        ${CATS.map(s => `
                            <option ${f.cat == s ? 'selected' : ''}>
                                ${s}
                            </option>
                        `)}
                    </select>

                </div>

                <br>

                ${tbl(CHW, c.map(x => ct(x, 1)))}

            </div>
        `;
    },

    // WARDEN: MAINTENANCE STAFF

    warden_staff() {
        const st = T().users.filter(u => u.role == 'staff');

        return `
            <div class="card">
                ${tbl(
                    ['Name', 'Specialization', 'Phone', 'Active jobs', 'Completed'],

                    st.map(s => {
                        const a = T().assignments
                            .filter(x => x.staff_id == s.id)
                            .map(x => T().complaints.find(
                                c => c.id == x.complaint_id
                            ));

                        return `
                            <tr>
                                <td>${s.name}</td>
                                <td>${s.spec}</td>
                                <td>${s.phone}</td>
                                <td>${a.filter(c => c && OPEN.includes(c.status)).length}</td>
                                <td>${a.filter(c => c && !OPEN.includes(c.status)).length}</td>
                            </tr>
                        `;
                    })
                )}
            </div>
        `;
    },

    // WARDEN: MAINTENANCE SCHEDULE

    warden_tasks() {
        return `
            <div class="card">
                <h3>Preventive maintenance</h3>

                ${tbl(
                    ['Task', 'Hostel', 'Assigned to', 'Due', 'Frequency', 'Status', ''],

                    T().tasks.map(k => `
                        <tr>
                            <td>${k.title}</td>
                            <td>${H(k.hostel_id)}</td>
                            <td>${uname(k.staff_id)}</td>
                            <td>${k.due}</td>
                            <td>${k.freq}</td>
                            <td>${bdg(k.status)}</td>

                            <td>
                                ${k.status != 'Done'
                                    ? `<button
                                        class="btn sm"
                                        onclick="nextT(${k.id})"
                                      >
                                        ${k.status == 'Scheduled' ? 'Start' : 'Mark done'}
                                      </button>`
                                    : ''
                                }
                            </td>
                        </tr>
                    `)
                )}
            </div>
        `;
    },

    // WARDEN: ROOMS & OCCUPANCY

    warden_rooms() {
        return `
            <div class="card">
                ${tbl(
                    [
                        'Room',
                        'Hostel',
                        'Floor',
                        'Capacity',
                        'Occupied',
                        'Occupancy',
                        'Open complaints'
                    ],

                    T().rooms.map(r => {
                        const o = T().users.filter(
                            u => u.room_id == r.id && u.role == 'student'
                        ).length;

                        return `
                            <tr>
                                <td>${r.number}</td>
                                <td>${H(r.hostel_id)}</td>
                                <td>${r.floor}</td>
                                <td>${r.capacity}</td>
                                <td>${o}</td>

                                <td style="width:140px">
                                    <div class="bar">
                                        <i style="width:${o / r.capacity * 100}%"></i>
                                    </div>
                                </td>

                                <td>
                                    ${T().complaints.filter(
                                        c => c.room_id == r.id &&
                                             OPEN.includes(c.status)
                                    ).length}
                                </td>
                            </tr>
                        `;
                    })
                )}
            </div>
        `;
    },

    // WARDEN: STUDENTS

    warden_students() {
        return `
            <div class="card">
                ${tbl(
                    [
                        'Name',
                        'Roll No',
                        'Dept',
                        'Year',
                        'Room',
                        'Phone',
                        'Complaints'
                    ],

                    T().users.filter(u => u.role == 'student').map(u => `
                        <tr>
                            <td>${u.name}</td>
                            <td>${u.roll}</td>
                            <td>${u.dept}</td>
                            <td>${u.year}</td>
                            <td>${rn(u.room_id)}</td>
                            <td>${u.phone}</td>

                            <td>
                                ${T().complaints.filter(
                                    c => c.student_id == u.id
                                ).length}
                            </td>
                        </tr>
                    `)
                )}
            </div>
        `;
    },

    // WARDEN: OUTPASS APPROVALS

    warden_outpass() {
        return `
            <div class="card">
                ${tbl(
                    [
                        'Student',
                        'Type',
                        'From',
                        'To',
                        'Reason',
                        'Status',
                        ''
                    ],

                    T().outpasses.map(o => `
                        <tr>
                            <td>${uname(o.student_id)}</td>
                            <td>${o.type}</td>
                            <td>${o.from}</td>
                            <td>${o.to}</td>
                            <td>${o.reason}</td>
                            <td>${bdg(o.status)}</td>

                            <td>
                                ${o.status == 'Pending'
                                    ? `
                                        <button
                                            class="btn ok sm"
                                            onclick="decO(${o.id}, 'Approved')"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            class="btn bad sm"
                                            onclick="decO(${o.id}, 'Rejected')"
                                        >
                                            Reject
                                        </button>
                                    `
                                    : ''
                                }
                            </td>
                        </tr>
                    `)
                )}
            </div>
        `;
    },

    // WARDEN: NOTICES

    warden_notices() {
        return `
            <div class="grid g2">

                <div class="card">
                    <h3>Post notice</h3>

                    <label>Title</label>
                    <input id="nt">

                    <label>Audience</label>

                    <select id="na">
                        <option>All</option>
                        <option>Gayatri Hostel</option>
                        <option>Vivekanand Hostel</option>
                    </select>

                    <label>Message</label>
                    <textarea id="nb"></textarea>

                    <br>

                    <button class="btn" onclick="postN()">
                        Publish
                    </button>
                </div>

                <div class="card">
                    <h3>Published</h3>
                    ${notices()}
                </div>

            </div>
        `;
    },

    // WARDEN: REPORTS

    warden_reports() {
        const c = T().complaints;

        const dn = c.filter(x => x.resolved_on);

        const avg = dn.length
            ? (
                dn.reduce(
                    (a, x) => a +
                        (new Date(x.resolved_on) - new Date(x.created)) / 864e5,
                    0
                ) / dn.length
            ).toFixed(1)
            : '-';

        const cr = count(
            c.filter(x => x.rating),
            x => x.rating + ' star'
        );

        return `
            <div class="grid g4">
                ${stat(avg + ' days', 'Avg resolution time')}
                ${stat(Math.round(dn.length / c.length * 100) + '%', 'Resolution rate', 'ok')}
                ${stat(c.filter(x => x.status == 'Rejected').length, 'Rejected')}
            </div>

            <br>

            <div class="grid g2">

                <div class="card">
                    <h3>By priority</h3>
                    ${bars(count(c, x => x.priority))}
                </div>

                <div class="card">
                    <h3>By hostel</h3>
                    ${bars(count(c, x => H(R(x.room_id).hostel_id)))}
                </div>

                <div class="card">
                    <h3>Satisfaction ratings</h3>
                    ${bars(cr)}
                </div>

                <div class="card">
                    <h3>Staff workload (open jobs)</h3>

                    ${bars(
                        count(
                            c.filter(
                                x => OPEN.includes(x.status) && DB.staffOf(x.id)
                            ),
                            x => uname(DB.staffOf(x.id))
                        )
                    )}
                </div>

            </div>
        `;
    },

    // WARDEN: ACTIVITY LOG

    warden_log() {
        return `
            <div class="card">
                ${tbl(
                    ['When', 'Complaint', 'Status', 'Note', 'By'],

                    T().complaint_history
                        .slice()
                        .reverse()
                        .slice(0, 40)
                        .map(h => `
                            <tr>
                                <td>${h.at}</td>
                                <td>#${h.complaint_id}</td>
                                <td>${bdg(h.status)}</td>
                                <td>${h.note}</td>
                                <td>${uname(h.by)}</td>
                            </tr>
                        `)
                )}
            </div>
        `;
    }
};

// OPEN COMPLAINT DETAILS

function openC(id) {
    const c = T().complaints.find(x => x.id == id);
    const w = S.role == 'warden';

    const hs = T().complaint_history.filter(
        h => h.complaint_id == id
    );

    const sid = DB.staffOf(id);

    let act = '';

    if (w) {
        act = `
            <div class="card" style="margin-top:14px">

                <h3>Warden actions</h3>

                <div class="row">

                    <select id="as">
                        <option value="">Assign staff...</option>

                        ${T().users
                            .filter(u => u.role == 'staff')
                            .map(u => `
                                <option
                                    value="${u.id}"
                                    ${sid == u.id ? 'selected' : ''}
                                >
                                    ${u.name} (${u.spec})
                                </option>
                            `)
                        }
                    </select>

                    <button class="btn sm" onclick="doAssign(${id})">
                        Assign
                    </button>

                </div>

                <div class="row" style="margin-top:8px">

                    <select id="ss">
                        ${[
                            'Submitted',
                            'Assigned',
                            'In Progress',
                            'Resolved',
                            'Rejected',
                            'Reopened'
                        ].map(s => `
                            <option ${c.status == s ? 'selected' : ''}>
                                ${s}
                            </option>
                        `)}
                    </select>

                    <input id="sn" placeholder="Note (optional)">

                    <button class="btn sm" onclick="doStatus(${id})">
                        Update
                    </button>

                </div>

            </div>
        `;
    } else if (c.status == 'Resolved') {
        act = `
            <div class="card" style="margin-top:14px">

                <h3>Rate the resolution</h3>

                <div id="stars">
                    ${[1, 2, 3, 4, 5].map(i => `
                        <span
                            class="star"
                            onclick="setR(${i})"
                        >
                            &#9733;
                        </span>
                    `).join('')}
                </div>

                <input
                    id="fb"
                    placeholder="Feedback (optional)"
                    style="margin:8px 0"
                >

                <div class="row">

                    <button
                        class="btn ok sm"
                        onclick="doRate(${id})"
                    >
                        Submit &amp; close
                    </button>

                    <button
                        class="btn bad sm"
                        onclick="reopen(${id})"
                    >
                        Not fixed - reopen
                    </button>

                </div>

            </div>
        `;
    }

    showM(`
        <div class="row">

            <h3 style="flex:1">
                #${c.id} ${c.title}
            </h3>

            <button class="btn sec sm" onclick="closeM()">
                Close
            </button>

        </div>

        <p>
            ${bdg(c.status)}
            ${pri(c.priority)}

            <span class="mut small">
                ${c.category} |
                Room ${rn(c.room_id)} |
                ${uname(c.student_id)} |
                ${c.created}
            </span>
        </p>

        <p style="margin:10px 0">
            ${c.description}
        </p>

        <p class="mut small">
            Assigned to:
            ${sid ? uname(sid) : 'Not assigned'}

            ${c.rating ? ` | Rating: ${c.rating}/5` : ''}
        </p>

        <h3 style="margin-top:14px">
            Timeline
        </h3>

        <div class="tl">
            ${hs.map(h => `
                <div>
                    <b>${h.status}</b>

                    <span class="mut small">
                        ${h.at} by ${uname(h.by)}
                    </span>

                    <br>

                    <span class="mut">
                        ${h.note}
                    </span>
                </div>
            `).join('')}
        </div>

        ${act}
    `);
}

let RV = 0;

function setR(n) {
    RV = n;

    document.querySelectorAll('.star').forEach((s, i) => {
        s.classList.toggle('on', i < n);
    });
}

function doRate(id) {
    if (!RV) return toast('Pick a rating');

    DB.rate(id, RV, $('#fb').value);

    closeM();
    render();

    toast('Thanks for your feedback');
}

function reopen(id) {
    DB.setStatus(
        id,
        'Reopened',
        'Student says issue persists',
        S.user.id
    );

    closeM();
    render();

    toast('Complaint reopened');
}

function doAssign(id) {
    const v = $('#as').value;

    if (!v) return toast('Select staff');

    DB.assign(id, v, S.user.id);

    closeM();
    render();

    toast('Staff assigned');
}

function doStatus(id) {
    DB.setStatus(
        id,
        $('#ss').value,
        $('#sn').value,
        S.user.id
    );

    closeM();
    render();

    toast('Status updated');
}

function submitC() {
    const t = $('#ft').value.trim();

    if (!t) return toast('Enter a title');

    DB.addComplaint({
        category: $('#fc').value,
        title: t,
        priority: $('#fp').value,
        description: $('#fd').value || '-',
        room_id: S.user.room_id
    }, S.user.id);

    toast('Complaint submitted');
    go('mine');
}

function applyO() {
    if (!$('#of').value || !$('#oo').value) {
        return toast('Select dates');
    }

    T().outpasses.push({
        id: DB.nid('outpasses'),
        student_id: S.user.id,
        type: $('#ot').value,
        from: $('#of').value,
        to: $('#oo').value,
        reason: $('#or').value || '-',
        status: 'Pending'
    });

    DB.save();
    render();

    toast('Request sent to warden');
}

function decO(id, s) {
    T().outpasses.find(o => o.id == id).status = s;

    DB.save();
    render();

    toast('Outpass ' + s.toLowerCase());
}

function nextT(id) {
    const k = T().tasks.find(x => x.id == id);

    k.status = k.status == 'Scheduled'
        ? 'In Progress'
        : 'Done';

    DB.save();
    render();
}

function postN() {
    const t = $('#nt').value.trim();

    if (!t) return toast('Enter a title');

    T().notices.push({
        id: DB.nid('notices'),
        title: t,
        body: $('#nb').value,
        aud: $('#na').value,
        at: new Date().toISOString().slice(0, 10)
    });

    DB.save();
    render();

    toast('Notice published');
}

render();
