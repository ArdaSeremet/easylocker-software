<template>
<h2>Package Reservation</h2>
<div v-if="!showLoading && error == null" class="final">
    <div class="error-wrapper success-wrapper">
        <span>Your reservation has been created and all the details, including the barcode, have been sent to the recipient via e-mail. If you have any questions, feel free contact us. Have a nice day!</span>
    </div>
</div>
<div v-else-if="error">
    <div class="error-wrapper">
        <span>{{ error }}</span>
    </div>
</div>
<div v-else class="loading">
    Loading...
</div>
</template>

<style scoped>
h2 {
    font-size: 32px;
    color: #222;
    margin: 20px;
    border-bottom: 1px solid #063974;
    padding-bottom: 5px;
}

.error-wrapper {
    background-color: rgba(255, 0, 0, .7);
    border: 1px solid rgba(255, 0, 0, 1);
    padding: 20px;
    margin: 20px;
    color: #FFF;
}

.success-wrapper {
    background-color: rgba(0, 150, 80, .7);
    border: 1px solid rgba(0, 150, 80, 1);
}

.loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 80px;
}
</style>

<script>
import * as CONFIG from '@/./config'

export default {
    name: 'Leave/Final',
    data() {
        return {
            showLoading: true,
            drawerSize: '',
            name: '',
            email: '',
            availableDrawerSizes: ['s', 'm', 'l', 'xl'],
            error: null,
            emailRegex: /\S+@\S+\.\S+/
        }
    },
    mounted() {
        let drawerSize = this.$route.query.sizeCode
        let name = this.$route.query.name
        let email = this.$route.query.email
        let barcodeNumber = Math.floor(Math.pow(10, 12-1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12-1) - 1));

        if(!this.availableDrawerSizes.includes(drawerSize)) {
            this.error = 'Invalid drawer size. Please try again.'
            this.showLoading = false
            return
        }

        if(name.length <= 0) {
            this.error = 'Recipient name cannot be empty. Please try again.'
            this.showLoading = false
            return
        }

        if(!this.emailRegex.test(email)) {
            this.error = 'Email address seems invalid. Please try again.'
            this.showLoading = false
            return
        }

        CONFIG.db.query(`UPDATE drawers SET 
        recipient_name = ?,
        recipient_email = ?,
        user_id = '-1',
        recipient_phone = ?,
        barcode = ?,
        status = 1 
        WHERE size = ? AND status = ? AND locker_id = ? LIMIT 1`, [
            name, email, '0', barcodeNumber, drawerSize, 0, 2
        ], (err, res) => {
            if(err) {
                console.dir(err);
                this.error = 'An internal system error occured. That\'s all we know... Please try again later.'
                this.showLoading = false
                return err;
            }
            CONFIG.postData('http://easylocker.plushwsw.com/api/recipient-send-mail.php',
            `lockerId=${encodeURIComponent('2')}&barcodeNumber=${encodeURIComponent(barcodeNumber)}`
            , data => {
                if(data.status == 'error') {
                    console.dir(data);
                    this.error = 'An internal system error occured. That\'s all we know... Please try again later.'
                    this.showLoading = false
                    return data
                }
                this.showLoading = false
                return true
            })                  

            return res
        })
    }
}
</script>
