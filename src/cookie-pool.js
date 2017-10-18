class CookiePool {

    constructor() {
        // Set in memory pool
        this.pool = [];
        // Clear exceeded cookies
        setInterval(() => {
            let timeDiff = 1000 * 60 * 60 * 5
            let currTime = Number(new Date())
            this.pool = this.pool.filter((cookie) => {
                let deltaTime = (currTime - cookie.time)
                if (timeDiff > deltaTime) {
                    return cookie
                }
            })
        },1000 * 60 * 5)
    }

    /**
     * Returns un-exceeded cookie
     * @param timeDiff  Milliseconds
     * @returns {Promise}
     */
    get(timeDiff) {
        return new Promise((resolve, reject) => {
            try {
                this.awaitPool(timeDiff, resolve)
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * Add cookie to pool
     * @param cookie
     */
    set(cookie) {
        console.log(cookie);
        this.pool.push({
            key: cookie.key,
            value: cookie.value,
            time: Number(new Date())
        })
    }

    /**
     * Returns un-exceeded cookie from pool.
     * Wait if pool is empty
     * @param timeDiff
     * @param resolve
     */
    awaitPool(timeDiff, resolve) {
        let selectedCookie = null
        let currTime = Number(new Date())
        for (let index in this.pool) {
            let cookie = this.pool[index]
            let deltaTime = (currTime - cookie.time)
            if (timeDiff > deltaTime) {
                selectedCookie = cookie
            }
        }
        if (selectedCookie === null) {
            setTimeout(() => {
                this.awaitPool(timeDiff, resolve)
            }, 1000)
        } else {
            this.pool = this.pool.filter((cookie) => {
                return cookie.time !== selectedCookie.time
            })
            resolve(selectedCookie)
        }
    }

    /**
     * Return size of pool
     * @returns {Number}
     */
    getPoolSize(){
        return this.pool.length
    }
}

module.exports = new CookiePool()
