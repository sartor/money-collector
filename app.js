new Vue({
    el: '#app',
    data: {
        events: [],
        selectedEvent: null,
    },
    computed: {
        sEvent() {
            if (!this.events[this.selectedEvent]) {
                return;
            }

            const event = Object.assign({}, this.events[this.selectedEvent]);

            if (event.members.length) {
                event.actual = event.members.reduce((acc, cur) => {
                    return acc + (cur.closed ? parseInt(cur.required, 10) : 0)
                }, 0);
            }

            return event;
        }
    },
    methods: {
        onEventSelect(newEventIndex) {
            this.selectedEvent = newEventIndex;
            localStorage.setItem('selectedEvent', this.selectedEvent);
        },
        onEventNew() {
            const newCount = this.events.push({
                name: 'New event',
                required: 0,
                members: [],
            });

            this.selectedEvent = newCount - 1;
        },
        onEventNameChange(event) {
            this.events[this.selectedEvent].name = event.target.value;
            this.saveAll();
        },
        onEventRequiredChange(event) {
            this.events[this.selectedEvent].required = event.target.value;
            this.saveAll();
        },
        onEventDelete() {
            this.events.splice(this.selectedEvent, 1);
            this.saveAll();
        },
        onMemberRequiredChange(memberIndex, event) {
            const member = this.getMember(memberIndex);
            member.required = event.target.value;
            this.saveAll();
        },
        onMemberCommentChange(memberIndex, event) {
            const member = this.getMember(memberIndex);
            member.comment = event.target.value;
            this.saveAll();
        },
        onMemberClosed(memberIndex) {
            const member = this.getMember(memberIndex);
            member.closed = ! member.closed;
            this.saveAll();
        },
        onMemberIgnore(memberIndex) {
            const member = this.getMember(memberIndex);
            member.ignore = ! member.ignore;
            this.saveAll();
        },
        getMember(memberIndex) {
            return this.events[this.selectedEvent].members[memberIndex]
        },
        saveAll() {
            localStorage.setItem('events', JSON.stringify(this.events));
        },
    },
    created() {
        this.events = JSON.parse(localStorage.getItem('events'));
        this.selectedEvent = parseInt(localStorage.getItem('selectedEvent'), 10);
    }
});