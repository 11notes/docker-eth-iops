const p = process.argv.slice(2);
const chalk = require('chalk');
const readline = require('readline');

class FIO{
    ash;
    iops = {
        min:10000
    };

    constructor(){
        this.ash = require('child_process').exec;
    }

    test(mode, depth, blockSize){
        const opt = {
            mode:mode,
            seconds:60,
            depth:depth,
            blockSize:blockSize,
            i:0,
            int:null,
        };

        opt.int = setInterval(()=>{
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0, null);
            process.stdout.write(`Test "${chalk.green.bold(p[0])}" (${((opt.i * 100) / opt.seconds).toFixed(2)}%) @ Blocksize: ${chalk.blue.bold(opt.blockSize)} / Queuedepth: ${chalk.red.bold(opt.depth)} / Type:Random Write`);
            opt.i++;
        }, 1000);
        this.cli(`cd /iops && fio --name=rw --ioengine=libaio --direct=1 --zero_buffers --rw=${opt.mode} --bs=${opt.blockSize} --numjobs=1 --size=4g --iodepth=${opt.depth} --runtime=${opt.seconds} --time_based --end_fsync=1 --output-format json`)
            .then((result)=>{
                clearInterval(opt.int);
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0, null);
                process.stdout.write(result);
            });
    }

    async cli(cmd){
        return new Promise((resolve, reject) => {
            this.ash(cmd, (err, stdout, stderr) => {
                if(err) reject(stderr);
                resolve(this.stats(JSON.parse(stdout)));
            });
        });
    }

    stats(fio){
        const stats = {
            iops:parseInt(fio.jobs[0].write.iops_mean),
            latency:parseFloat((fio.jobs[0].write.clat_ns.percentile['95.000000']/10**6).toFixed(6))
        };

        this.status = ((stats.iops >= this.iops.min) ? true : false);

        const l = '##################################################'
        const lines = [];
        lines.push(`${chalk.bold(this.highlight(l))}`);
        lines.push(`${chalk.bold(this.highlight(l))}`);
        lines.push('');
        lines.push(`Status: ${(this.status) ? 'Passed' : 'Failed'}`);
        lines.push(`Required IOPS: ${this.iops.min}`);
        lines.push(`Device IOPS: ${stats.iops}`);
        lines.push('');
        lines.push(`Device latency: ${stats.latency}ms`);
        lines.push('');
        lines.push(`${chalk.bold(this.highlight(l))}`);
        lines.push(`${chalk.bold(this.highlight(l))}`);

        for(let i=0; i<lines.length; i++){
            if(lines[i] === `${chalk.bold(this.highlight(l))}`){
                lines[i] = `${chalk.bold(this.highlight('#'))}${lines[i]}${chalk.bold(this.highlight('#'))}`;
            }else{
                let space = '';
                for(let j=1; j<(l.length - lines[i].length) - 1; j++){
                    space += ' ';
                }
                lines[i] = `${chalk.bold(this.highlight('#'))} ${chalk.bold(this.highlight(lines[i]))} ${space}${chalk.bold(this.highlight('#'))}`;
            }
        }
        return(lines.join(`\r\n`));
    }

    highlight(s){
        if(this.status){
            return(chalk.green(s));
        }
        return(chalk.red(s));
    }
}

(async()=>{
    try{
        const fio = new FIO();
        switch(true){
            case /default/i.test(p[0]):      
                fio.test('randwrite', 1, '4k');
            break;

            case /write-16q-16M/i.test(p[0]):
                fio.test('randwrite', 16, '1M');
            break;

            default:
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0, null);
                process.stdout.write(`The requested job ${p[0]} does not exist!\r\n`);
        }
    }catch(e){
        console.error(e);
    }
})();