new Vue({
    el: '#app',
    data: {
        events: [],
        selectedEvent: null,
        membersFilter: false,
    },
    computed: {
        sEvent() {
            if (!this.events[this.selectedEvent]) {
                return;
            }

            const event = Object.assign({}, this.events[this.selectedEvent]);

            if (event.members.length) {
                event.actual = event.members.reduce((acc, cur) => {
                    return acc +  (cur.done ? parseInt(cur.required ? cur.required : 0, 10) : 0);
                }, 0);

                event.filteredMembers = event.members.filter(member => !this.membersFilter || !member.done);
            }

            return event;
        },
    },
    methods: {
        onEventSelect(newEventIndex) {
            this.selectedEvent = newEventIndex;
            localStorage.setItem('selectedEvent', this.selectedEvent);
        },
        onEventNew() {
            const newCount = this.events.push({
                name: 'New event',
                info: '',
                required: '',
                goal: '',
                members: [],
                currency: 'UAH',
            });

            this.selectedEvent = newCount - 1;
        },
        onEventNameChange(event) {
            this.$set(this.events[this.selectedEvent], 'name', event.target.value);
            this.saveAll();
        },
        onEventInfoChange(event) {
            this.$set(this.events[this.selectedEvent], 'info', event.target.value);
            this.saveAll();
        },
        onEventRequiredChange(event) {
            this.$set(this.events[this.selectedEvent], 'required', event.target.value);
            this.saveAll();
        },
        onEventGoalChange(event) {
            this.$set(this.events[this.selectedEvent], 'goal', event.target.value);
            this.saveAll();
        },
        onEventCopyMembers(event) {
            const fromEventIndex = event.target.value;

            this.events[fromEventIndex].members.forEach(member => {
                this.events[this.selectedEvent].members.push({
                    name: member.name,
                    done: false,
                    required: this.events[this.selectedEvent].required,
                });
            });

            event.target.value = '-1';

            this.saveAll();
        },
        onEventDelete() {
            if (confirm("Sure?")) {
                this.events.splice(this.selectedEvent, 1);
                this.saveAll();
            }
            if (this.selectedEvent > this.events.length - 1) {
                this.onEventSelect(this.events.length - 1);
            }
        },
        onMembersFilterChange() {
            this.membersFilter = ! this.membersFilter;
        },
        onMemberAdd() {
            const event = this.events[this.selectedEvent];
            const name = prompt("Member name");

            if (name === null) {
                return;
            }

            event.members.push({
                name,
                required: event.required,
            });
            this.saveAll();
        },
        onMemberRequiredChange(memberIndex, event) {
            const member = this.getMember(memberIndex);
            this.$set(member, 'required', event.target.value);
            this.saveAll();
        },
        onMemberCommentChange(memberIndex, event) {
            const member = this.getMember(memberIndex);
            this.$set(member, 'comment', event.target.value);
            this.saveAll();
        },
        onMemberDone(memberIndex) {
            const member = this.getMember(memberIndex);
            this.$set(member, 'done', ! member.done);
            this.saveAll();
        },
        onMemberRename(memberIndex) {
            const member = this.getMember(memberIndex);
            const name = prompt("Member name", member.name);
            if (name === null) {
                return;
            }

            this.$set(member, 'name', name);
            this.saveAll();
        },
        onMemberDelete(memberIndex) {
            this.events[this.selectedEvent].members.splice(memberIndex, 1);
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

        if (!this.events) {
            this.events = [];
        }
        this.selectedEvent = parseInt(localStorage.getItem('selectedEvent'), 10);
    }
});